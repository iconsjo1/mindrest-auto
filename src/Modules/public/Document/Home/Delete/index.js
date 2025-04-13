const AWS = require('aws-sdk');

module.exports = route => app => {
 // Delete Documents
 app.delete(route, async (req, res) => {
  let client = null;
  let begun = false;
  try {
   const {
    locals: {
     utils: { db, isPositiveInteger, pgRowMode },
     do: { credentials, bucket },
    },
   } = res;
   const s3 = new AWS.S3({ ...credentials, s3BucketEndpoint: true });

   const { id } = req.query;
   if (!isPositiveInteger(id)) return res.status(404).json({ success: false, message: 'Document was not found.' });

   client = await db.connect();

   await client.query('BEGIN').then(() => (begun = true));

   const { rows: deletedDocument } = await client.query(
    `DELETE FROM public."Documents"
     WHERE 1=1 AND id = $1
     RETURNING document_path,
               document_extension,
               document_mimetype,
               document_category_id`,
    [id]
   );

   if (0 < deletedDocument.length) {
    const [{ document_path, document_extension, document_mimetype, document_category_id }] = deletedDocument;

    const is_resizable = await client
     .query(pgRowMode('SELECT is_resizable FROM public."Document_Categories" WHERE id = $1', [document_category_id]))
     .then(({ rows }) => rows[0]?.[0]);

    if (undefined === is_resizable) throw Error('Document category was not found.');

    if (true === is_resizable && /^ima/.test(document_mimetype)) {
     await Promise.all([
      s3.deleteObject({ Bucket: bucket, Key: `${document_path}-small.${document_extension}` }).promise(),
      s3.deleteObject({ Bucket: bucket, Key: `${document_path}-medium.${document_extension}` }).promise(),
      s3.deleteObject({ Bucket: bucket, Key: `${document_path}-full.${document_extension}` }).promise(),
     ]);
    } else await s3.deleteObject({ Bucket: bucket, Key: `${document_path}.${document_extension}` }).promise();
   }

   await client.query('COMMIT;').then(() => (begun = false));

   res.json({ Success: true, message: 'Document was deleted successfully.', data: deletedDocument });
  } catch ({ message }) {
   res.json({ success: false, message });
  } finally {
   if (null != client) {
    if (true === begun) {
     try {
      await client.query('ROLLBACK TO SAVEPOINT ' + SAVEPOINT);
     } catch ({ message }) {
      console.error(message);
     }
    }
    client.release();
   }
  }
 });
};
