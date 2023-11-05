const AWS = require('aws-sdk');

module.exports = route => app => {
 // Delete Documents
 app.delete(route, async (req, res) => {
  const SAVEPOINT = 'FRESH';

  let client = null;
  let transactionStarted = false;
  try {
   const {
    locals: {
     utils: { db, isPositiveInteger },
     do: { credentials, bucket },
    },
   } = res;
   const s3 = new AWS.S3({
    ...credentials,
    s3BucketEndpoint: true,
   });

   const { id } = req.query;
   if (!isPositiveInteger(id))
    return res.status(404).json({ success: false, message: 'Document was not found.' });

   client = await db.connect();

   await client.query('BEGIN;SAVEPOINT ' + SAVEPOINT).then(_ => (transactionStarted = true));

   const deletedDocument = await client
    .query('DELETE FROM public."Documents" WHERE 1=1 AND id = $1 RETURNING *', [id])
    .then(({ rows }) => rows);

   if (0 < deletedDocument.length) {
    const [
     { is_resizable, document_path, document_extension, document_mimetype, document_category_id },
    ] = deletedDocument;

    const cat = await client
     .query({
      text: 'SELECT category_name FROM public."Document_Categories" WHERE id=$1',
      values: [document_category_id],
      rowMode: 'array',
     })
     .then(({ rows }) => rows[0][0]);

    try {
     if ('Picture' === cat && true === is_resizable && /^ima/.test(document_mimetype)) {
      await Promise.all([
       s3
        .deleteObject({
         Bucket: bucket,
         Key: `${document_path}-small.${document_extension}`,
        })
        .promise(),
       s3
        .deleteObject({
         Bucket: bucket,
         Key: `${document_path}-medium.${document_extension}`,
        })
        .promise(),
       s3
        .deleteObject({
         Bucket: bucket,
         Key: `${document_path}-full.${document_extension}`,
        })
        .promise(),
      ]);
     } else
      await s3
       .deleteObject({
        Bucket: bucket,
        Key: `${document_path}.${document_extension}`,
       })
       .promise();
    } catch ({ message }) {
     throw Error(message);
    }
   }

   await client.query('COMMIT;').then(_ => (transactionStarted = false));
   client.release();

   res.json({
    Success: true,
    message: 'Document was deleted successfully.',
    data: deletedDocument,
   });
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
