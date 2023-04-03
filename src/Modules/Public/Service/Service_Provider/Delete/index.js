module.exports = route => (app, db) => {
 // Delete Service Providers
 app.delete(route, async (req, res) => {
  try {
   const { id } = req.query;
   if (!id) return res.status(404).json({ success: false, msg: 'Service provider not found.' });

   const deletedServiceProvider = await db.query(
    'DELETE FROM public."Service_Providers" WHERE 1=1 AND id = $1 RETURNING *',
    [id]
   );

   res.json({
    Success: true,
    msg: 'Service Provider deleted successfully.',
    data: deletedServiceProvider.rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
