const fs = require('node:fs');
const path = require('node:path');
const cors = require('cors');

const CONTENT_DISPOSITION = 'Content-Disposition';

module.exports = route => (app, db) => {
 // Read Document
 app.get(
  route,
  cors({
   exposedHeaders: [CONTENT_DISPOSITION],
  }),
  async (req, res) => {
   try {
    const { db } = res.locals.utils;
    const { id, required_size = 'small' } = req.query;

    if (!id) return res.status(404).json({ success: false, msg: 'Document not found.' });

    const document = await db.query('SELECT * FROM public."Documents" WHERE 1=1 AND id=$1', [id]);

    if (0 === document.rows.length) throw new Error('Document not found in database.');

    const document_abs = { ...document.rows[0] };

    if (true === document_abs.is_resizable) {
     switch (required_size) {
      case 'small':
      case 'medium':
      case 'full':
       document_abs.document_path += '-' + required_size;
       break;
      default:
       throw new Error(`Required size of '${required_size}' is not available.`);
     }
    }

    document_abs.absulute_path = path.join(
     'C:/mclinic-uploadpath',
     `${document_abs.document_path}.${document_abs.document_extension}`
    );

    const stream = fs.createReadStream(document_abs.absulute_path);
    res.set({
     [CONTENT_DISPOSITION]: `attachment; filename='${path.basename(document_abs.absulute_path)}'`,
     'Content-Type': document_abs.document_mimetype,
    });
    stream.pipe(res);
   } catch (error) {
    res.json({ success: false, msg: error.message });
   }
  }
 );
};
