module.exports = (app, db) => {
 // Delete Doctor Speciality
 app.delete('/REST/doctor_specialities', async (req, res) => {
  try {
   const { id } = req.query;
   if (!id) return res.status(404).json({ success: false, msg: 'Doctor speciality not found.' });

   const deletedDoctorSpeciality = await db.query(
    'DELETE FROM public."Doctor_Specialities" WHERE 1=1 AND id = $1 RETURNING *',
    [id]
   );

   res.json({
    Success: true,
    msg: 'Doctor speciality deleted successfully.',
    data: deletedDoctorSpeciality.rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
