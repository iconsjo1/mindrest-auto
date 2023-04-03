module.exports = (app, db) => {
 // Delete Lab Test
 app.delete('/REST/lab_tests', async (req, res) => {
  try {
   const { id } = req.query;
   if (!id) return res.status(404).json({ success: false, msg: 'Lab test not found.' });

   const deletedLabTest = await db.query(
    'DELETE FROM public."Lab_Tests" WHERE 1=1 AND id = $1 RETURNING *',
    [id]
   );

   res.json({ Success: true, msg: 'Lab Test deleted successfully.', data: deletedLabTest.rows });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
