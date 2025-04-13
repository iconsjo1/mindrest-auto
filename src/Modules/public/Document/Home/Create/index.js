module.exports = route => app => {
 // Create DO-Document

 const { extname } = require('node:path');
 const { lookup } = require('mime-types');
 const multer = require('multer');
 const sharp = require('sharp');

 const upload = multer({ storage: multer.memoryStorage() });
 const AWS = require('aws-sdk');

 app.post(route, upload.single('file'), async (req, res) => {
  let client = null;
  let begun = false;
  try {
   const TODAYPATH = (d => [d.getFullYear(), d.getMonth() + 1, d.getDate()])(new Date());
   const {
    locals: {
     utils: { db, isString, isPositiveInteger, pgRowMode },
     do: { bucket, folder, credentials },
    },
   } = res;

   const {
    file,
    body: { document_category_id, document_filename: name, description },
   } = req;

   if (!isPositiveInteger(document_category_id)) throw Error('category_id must be a positive integer.');

   if (null == file) throw Error('File was not uploaded.');

   if (!isString(name)) throw Error('File name is not a string.');

   const ext = extname(file.originalname);
   const mimetype = lookup(ext);

   if (false === mimetype) throw Error('File extention of [' + ext + '] does not have a mimetype');

   const s3 = new AWS.S3({ ...credentials, s3BucketEndpoint: true });

   client = await db.connect();

   const is_resizable = await client
    .query(pgRowMode('SELECT is_resizable FROM public."Document_Categories" WHERE id=$1', [document_category_id]))
    .then(({ rows }) => {
     if (0 === rows.length)
      throw Error(`Document category id={${document_category_id}} is going to violate foreign key constraint.`);
     return rows[0][0];
    });

   const document = {
    document_filename: name,
    document_mimetype: mimetype,
    document_extension: ext.substring(1), // Omits the first char '.'
    description,
    document_category_id,
   };

   const docFields = Object.keys(document);
   const $docenc = docFields.map((_, i) => `$${i + 1}`);

   await client.query('BEGIN').then(() => (begun = true));

   const document_id = await client
    .query(
     pgRowMode(`INSERT INTO public."Documents"(${docFields}) VALUES(${$docenc}) RETURNING id`, Object.values(document))
    )
    .then(({ rows }) => parseInt(rows[0]?.[0], 10));

   if (!isNaN(document_id)) throw Error('Document was not inserted.');

   document.document_path = [folder, ...TODAYPATH, document_id].join('/');

   const { rows } = await client.query('UPDATE public."Documents" SET document_path=$1 WHERE id=$2 RETURNING *', [
    document.document_path,
    document_id,
   ]);

   if (true === is_resizable && /^ima/.test(mimetype)) {
    await Promise.all([
     s3
      .putObject({
       Body: await sharp(file.buffer).resize({ width: 48, height: 48 }).toBuffer(),
       Bucket: bucket,
       Key: document.document_path + '-small' + ext,
      })
      .promise(),
     s3
      .putObject({
       Body: await sharp(file.buffer).resize({ width: 300, height: 300 }).toBuffer(),
       Bucket: bucket,
       Key: document.document_path + '-medium' + ext,
      })
      .promise(),
     s3.putObject({ Body: file.buffer, Bucket: bucket, Key: document.document_path + '-full' + ext }).promise(),
    ]);
   } else await s3.putObject({ Body: file.buffer, Bucket: bucket, Key: document.document_path + ext }).promise();

   await client.query('COMMIT;').then(() => (begun = false));

   res.json({ success: true, msg: 'File was uploaded successfully.', data: rows });
  } catch ({ message }) {
   res.json({ success: false, message });
  } finally {
   if (null != client) {
    if (true === begun) {
     try {
      await client.query('ROLLBACK');
     } catch ({ message }) {
      console.error(message);
     }
    }
    client.release();
   }
  }
 });
};
