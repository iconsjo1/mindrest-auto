const { GetObjectCommand } = require('@aws-sdk/client-s3');
const { basename } = require('node:path');

module.exports = async (req, res) => {
 try {
  const {
   locals: {
    utils: { db, isPositiveInteger },
    do: { bucket, getS3 },
   },
  } = res;

  const { id, required_size } = req.query;

  if (!isPositiveInteger(id)) throw Error('document_id must be a positive integer.');

  const required_sizelc = required_size?.toLowerCase();

  const resizeCond = ['small', 'medium', 'full'].includes(required_sizelc)
   ? `document_mimetype ~* '^ima'
      AND EXISTS(
       SELECT 1
       FROM public."Document_Categories" dc
       WHERE d.document_category_id = dc.id
       AND is_resizable = true
      )`
   : '1=1';

  const s3 = getS3();

  const { rows: dbdocument } = await db.query(
   `SELECT
      CONCAT(document_path, '${'1=1' !== resizeCond ? '-' + required_size : ''}.', document_extension) "Key",
      document_mimetype mimetype
    FROM public."Documents" d
    WHERE id = $1 AND ${resizeCond}`,
   [id]
  );

  if (0 === dbdocument.length) throw Error('DB Document was not found.');

  const [{ Key, mimetype }] = dbdocument;

  const cmd = new GetObjectCommand({ Bucket: bucket, Key });

  const { Body } = await s3.send(cmd);

  res.set({ 'Content-Disposition': `attachment; filename=${basename(Key)}`, 'Content-Type': mimetype });

  Body.pipe(res);
 } catch ({ message }) {
  res.json({ success: false, message: message ?? 'File may not exists.' });
 }
};
