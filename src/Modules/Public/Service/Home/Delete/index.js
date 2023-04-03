module.exports = route => (app, db) => {
 // Delete Service
 app.delete(route, async (req, res) => {
  try {
   const { id } = req.query;
   if (!id) return res.status(404).json({ success: false, msg: 'Service not found.' });

   const deletedService = await db.query(
    'DELETE FROM public."Services" WHERE 1=1 AND id = $1 RETURNING *',
    [id]
   );

   res.json({ Success: true, msg: 'Service deleted successfully.', data: deletedService.rows });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
