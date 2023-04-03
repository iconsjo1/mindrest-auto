module.exports = route => (app, db) => {
 // Delete Vital Sign
 app.delete(route, async (req, res) => {
  try {
   const { id } = req.query;
   if (!id) return res.status(404).json({ success: false, msg: 'Vital sign not found.' });

   const deletedVitalSign = await db.query(
    'DELETE FROM public."Vital_Signs" WHERE 1=1 AND id = $1 RETURNING *',
    [id]
   );

   res.json({
    Success: true,
    msg: 'Vital sign deleted successfully.',
    data: deletedVitalSign.rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
