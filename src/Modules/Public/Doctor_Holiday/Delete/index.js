module.exports = route => (app, db) => {
 // Delete Prescription Medicine
 app.delete(route, async (req, res) => {
  try {
   const { id } = req.query;
   if (!id) return res.status(404).json({ success: false, msg: 'Doctor holidaty not found.' });

   const deletedDoctorHoliday = await db.query(
    'DELETE FROM public."Doctor_Holidays" WHERE 1=1 AND id = $1 RETURNING *',
    [id]
   );

   res.json({
    Success: true,
    msg: 'Doctor holiday deleted successfully.',
    data: deletedDoctorHoliday.rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
