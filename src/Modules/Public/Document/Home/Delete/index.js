module.exports = route => (app, db) => {
 // Delete Documents
 app.delete(route, async (req, res) => {
  try {
   const { db } = res.locals.utils;
   const { id } = req.query;
   if (!id) return res.status(404).json({ success: false, msg: 'Document not found.' });

   const deletedDocument = await db.query(
    'DELETE FROM public."Documents" WHERE 1=1 AND id = $1 RETURNING *',
    [id]
   );

   res.json({ Success: true, msg: 'Document deleted successfully.', data: deletedDocument.rows });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
