module.exports = route => (app, db) => {
 // Delete Patient
 app.delete(route, async (req, res) => {
  try {
   const { id } = req.query;
   if (!id) return res.status(404).json({ success: false, msg: 'Patient not found.' });

   const deletedPatient = await db.query(
    'DELETE FROM public."Patients" WHERE 1=1 AND id = $1 RETURNING *',
    [id]
   );

   res.json({ Success: true, msg: 'Patient deleted successfully.', data: deletedPatient.rows });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
