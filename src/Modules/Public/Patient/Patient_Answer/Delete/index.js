module.exports = route => (app, db) => {
 // Delete Patient Answer
 app.delete(route, async (req, res) => {
  try {
   const { id } = req.query;
   if (!id) return res.status(404).json({ success: false, msg: 'Patient answer not found.' });

   const deletedPatientAnswer = await db.query(
    'DELETE FROM public."Patient_Answers" WHERE 1=1 AND id = $1 RETURNING *',
    [id]
   );

   res.json({
    Success: true,
    msg: 'Patient answer deleted successfully.',
    data: deletedPatientAnswer.rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
