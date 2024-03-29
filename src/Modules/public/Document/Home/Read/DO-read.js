const AWS = require('aws-sdk');
const cors = require('cors');
const { basename } = require('node:path');

module.exports = route => app => {
 // Read DO-Document
 const CONTENT_DISPOSITION = 'Content-Disposition';

 app.use(route, cors({ exposedHeaders: [CONTENT_DISPOSITION] }));

 app.get(route, async (req, res) => {
  const {
   locals: {
    utils: { db, isPositiveInteger },
    do: { bucket, credentials },
   },
  } = res;

  const { id, required_size } = req.query;
  try {
   if (!isPositiveInteger(id)) throw Error('document_id must be a positive integer.');

   const required_sizelc = required_size?.toLowerCase();

   const resizeCond = ['small', 'medium', 'full'].includes(required_sizelc)
    ? `document_mimetype ilike 'ima%'
       AND EXISTS(
        SELECT 1
        FROM public."Document_Categories" dc
        WHERE d.document_category_id = dc.id
        AND true = is_resizable
       )`
    : '1=1';

   const s3 = new AWS.S3({
    ...credentials,
    s3BucketEndpoint: true,
   });

   const { rows: dbdocument } = await db.query(
    `SELECT 
        CONCAT(document_path, '${'1=1' !== resizeCond ? '-' + required_size : ''}.', document_extension) "Key",
        document_mimetype mimetype
    FROM public."Documents" d
   WHERE 1=1
    AND id = $1
    AND ${resizeCond}`.replace(/\s+/g, ' '),
    [id]
   );

   if (0 === dbdocument.length) throw Error('DB Document was not found.');

   const [{ Key, mimetype }] = dbdocument;

   const { Body } = await s3.getObject({ Bucket: bucket, Key }).promise();

   res.set({
    [CONTENT_DISPOSITION]: `attachment; filename=${basename(Key)}`,
    'Content-Type': mimetype,
   });
   res.end(Body, 'binary');
  } catch ({ message }) {
   res.json({ success: false, message: message ?? 'File may not exists.' });
  }
 });
};
