module.exports = route => (app, db) => {
 // Delete Document Category
 app.delete(route, async (req, res) => {
  try {
   const { db } = res.locals.utils;

   const { id } = req.query;
   if (!id) return res.status(404).json({ success: false, msg: 'Document categoty not found.' });

   const deletedDocumentCategory = await db.query(
    'DELETE FROM public."Document_Categories" WHERE 1=1 AND id = $1 RETURNING *',
    [id]
   );

   res.json({
    Success: true,
    msg: 'Document category deleted successfully.',
    data: deletedDocumentCategory.rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
