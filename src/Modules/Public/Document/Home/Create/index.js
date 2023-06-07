const fileupload = require('express-fileupload');
const { extname } = require('path');
const sharp = require('sharp');
const { mkdirSync, existsSync } = require('fs');

const IS_RESIZABLE = true;
const IS_NOT_RESIZABLE = false;

module.exports = route => (app, db) => {
 // Create Document
 app.post(route, fileupload({ createParentPath: true }), async (req, res) => {
  try {
   const { file } = req.files;
   if (!file.name) throw new Error('No file was uploaded.');

   req.body.document_mimetype = file.mimetype;
   req.body.document_category_id = +JSON.parse(req.body.document_category_id).value;

   const isResizable = 'true' === req.body.is_resizable;
   delete req.body.is_resizable;

   await db.query('BEGIN;SAVEPOINT fresh');
   const fields = Object.keys(req.body).join(',');
   const values = Object.values(req.body);
   const enc_values = [];

   for (let i = 0; i < values.length; enc_values.push(`$${++i}`));

   const newDocument_id = await db.query(
    `INSERT INTO public."Documents"(${fields}) VALUES(${enc_values.join(',')}) RETURNING *`,
    values
   );

   const { id: document_id, document_mimetype: mime } = newDocument_id.rows[0];

   if (!document_id) {
    await db.query('ROLLBACK TO SAVEPOINT fresh');
    throw new Error('Document was not uploaded properly');
   }

   // Saving location vars
   const d = new Date();
   const rootPath = 'C:/mclinic-uploadpath';
   const relativePath = [d.getFullYear(), d.getMonth() + 1, d.getDate()].join('/');
   const dir = rootPath + '/' + relativePath; // Absolute
   const filePath = dir + '/' + document_id; // Absolute
   const ext = extname(file.name);

   const updateDocumentPath = canResize => async () => {
    const newDocument = await db.query(
     'UPDATE public."Documents" SET document_path=$1,document_extension=$2,is_resizable=$3 WHERE id=$4 RETURNING *',
     [relativePath + '/' + document_id, ext.substring(1), canResize, document_id]
    );
    db.query(0 < newDocument.rows.length ? 'COMMIT' : 'ROLLBACK TO SAVEPOINT fresh');
    res.json({ success: true, msg: 'Document created successfully.', data: newDocument.rows });
   };

   if (isResizable && /^image/.test(mime)) {
    // Double check for security reasons.
    if (!existsSync(dir)) {
     mkdirSync(dir, { recursive: true });
    }
    await sharp(file.data).resize(48, 48).toFile(`${filePath}-small${ext}`);
    await sharp(file.data).resize(300, 300).toFile(`${filePath}-medium${ext}`);
    await sharp(file.data).toFile(`${filePath}-full${ext}`);
    await updateDocumentPath(IS_RESIZABLE)();
   } else {
    file.mv(filePath + ext, async err => {
     if (err) {
      await db.query('ROLLBACK TO SAVEPOINT fresh');
      return res.json({ success: false, msg: err.message });
     }
     await updateDocumentPath(IS_NOT_RESIZABLE)();
    });
   }
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
