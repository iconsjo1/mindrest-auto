module.exports = route => (app, db) => {
 // Delete Service Category
 app.delete(route, async (req, res) => {
  try {
   const { id } = req.query;
   if (!id) return res.status(404).json({ success: false, msg: 'Service category not found.' });

   const deletedServiceCategory = await db.query(
    'DELETE FROM public."Service_Categories" WHERE 1=1 AND id = $1 RETURNING *',
    [id]
   );

   res.json({
    Success: true,
    msg: 'Service category deleted successfully.',
    data: deletedServiceCategory.rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
