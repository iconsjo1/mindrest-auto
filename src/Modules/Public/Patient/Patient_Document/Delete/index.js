module.exports = route => (app, db) => {
 // Delete Patient Document
 app.delete(route, async (req, res) => {
  try {
   const { id } = req.query;
   if (!id) return res.status(404).json({ success: false, msg: 'Patient document not found.' });

   const deletedPatientDocument = await db.query(
    'DELETE FROM public."Patient_Documents" WHERE 1=1 AND id = $1 RETURNING *',
    [id]
   );

   res.json({
    Success: true,
    msg: 'Patient document deleted successfully.',
    data: deletedPatientDocument.rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
