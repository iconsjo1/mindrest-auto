module.exports = route => app => {
 // Create DO-Document
 let client = null;

 const { extname } = require('node:path');
 const { lookup } = require('mime-types');
 const multer = require('multer');
 const sharp = require('sharp');

 const upload = multer({ storage: multer.memoryStorage() });
 const AWS = require('aws-sdk');

 const SAVEPOINT = 'FRESH';
 const rowMode = 'array';
 const TODAY = new Date();

 app.post(route, upload.single('file'), async (req, res) => {
  let transactionStarted = false;
  try {
   const {
    locals: {
     utils: { db, isString, isPositiveInteger },
     do: { bucket, folder, credentials },
    },
   } = res;

   const {
    file,
    body: { document_category_id, is_resizable, document_filename: name, description },
   } = req;
   const canResize = '1' === is_resizable;

   if (!isPositiveInteger(document_category_id)) throw Error('category_id must be a positive integer.');

   if (null == file) throw Error('File was not uploaded.');

   if (!isString(name)) throw Error('File name is not a string.');

   const ext = extname(file.originalname);
   const mimetype = lookup(ext);

   if (false === mimetype) throw Error('File extention of [' + ext + '] does not have a mimetype');

   const s3 = new AWS.S3({
    ...credentials,
    s3BucketEndpoint: true,
   });
   client = await db.connect();

   const cat = await client
    .query({
     text: 'SELECT category_name FROM public."Document_Categories" WHERE id=$1',
     values: [document_category_id],
     rowMode,
    })
    .then(({ rows }) => rows[0][0]);

   if (!isString(cat))
    throw Error('Category id={' + document_category_id + '} is going to violate foreign key constraint.');

   const document = {
    document_filename: name,
    document_mimetype: mimetype,
    document_extension: ext.substring(1), // Omits first char '.'
    description: description,
    document_category_id,
    is_resizable: canResize,
   };

   const docFields = Object.keys(document);
   const doc_encValues = docFields.map((_, i) => `$${i + 1}`);

   await client.query('BEGIN;SAVEPOINT ' + SAVEPOINT);
   transactionStarted = true;

   const document_id = await client
    .query({
     text: `INSERT INTO public."Documents"(${docFields}) VALUES(${doc_encValues}) RETURNING id`,
     values: Object.values(document),
     rowMode,
    })
    .then(({ rows }) => parseInt(rows[0][0], 10));

   if (!isPositiveInteger(document_id)) throw Error('Document was not inserted.');

   document.document_path = [folder, TODAY.getFullYear(), TODAY.getMonth() + 1, TODAY.getDate(), document_id].join('/');

   let rows = [];

   if (true === canResize && /^ima/.test(mimetype) && 'Picture' === cat) {
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
     s3
      .putObject({
       Body: file.buffer,
       Bucket: bucket,
       Key: document.document_path + '-full' + ext,
      })
      .promise(),
    ]);
    const { rows: uploaded_document } = await client.query(
     'UPDATE public."Documents" SET document_path=$1 WHERE id=$2 RETURNING *',
     [document.document_path, document_id]
    );
    rows = uploaded_document;
   } else {
    await s3
     .putObject({
      Body: file.buffer,
      Bucket: bucket,
      Key: document.document_path + ext,
     })
     .promise();

    const { rows: uploaded_document } = await client.query(
     'UPDATE public."Documents" SET document_path=$1,is_resizable = false WHERE id=$2 RETURNING *',
     [document.document_path, document_id]
    );
    rows = uploaded_document;
   }

   await client.query('COMMIT;');
   transactionStarted = false;
   client.release();

   res.json({ success: true, msg: 'File was uploaded successfully.', data: rows });
  } catch ({ message }) {
   let msg = message;
   if (null != client) {
    if (true === transactionStarted) {
     try {
      await client.query('ROLLBACK TO SAVEPOINT ' + SAVEPOINT);
     } catch ({ message: rmessage }) {
      msg = rmessage;
     }
    }
    client.release();
   }
   res.json({ success: false, message: msg });
  }
 });
};
