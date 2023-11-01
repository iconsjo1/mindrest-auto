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
    ? "true = is_resizable AND '^ima' ~ document_mimetype"
    : '1=1';

   const s3 = new AWS.S3({
    ...credentials,
    s3BucketEndpoint: true,
   });

   const { rows: dbdocument } = await db.query(
   `SELECT 
        CONCAT(document_path, '-${required_size}.', document_extension) "Key",
        document_mimetype mimetype
    FROM public."Documents"
   WHERE 1=1 
    AND id = $1
    AND ${resizeCond}`.replace(/\s+/g, ' '),
    [id]
   );
   console.log(dbdocument, resizeCond);
   if (0 === dbdocument.length) throw Error('DB Document was not found.');

   const { Key, mimetype } = dbdocument;

   const data = await s3.getObject({ Bucket: bucket, Key }).promise();

   res.set({
    [CONTENT_DISPOSITION]: `attachment; filename=${basename(Key)}`,
    'Content-Type': mimetype,
   });
   res.end(data.Body, 'binary');
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
