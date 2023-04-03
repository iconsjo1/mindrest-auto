module.exports = (app, db) => {
 // Delete Medicine
 app.delete('/REST/medicines', async (req, res) => {
  try {
   const { id } = req.query;
   if (!id) return res.status(404).json({ success: false, msg: 'Medicine not found.' });

   const deletedMedicine = await db.query(
    'DELETE FROM public."Medicines" WHERE 1=1 AND id = $1 RETURNING *',
    [id]
   );

   res.json({ Success: true, msg: 'Medicine deleted successfully.', data: deletedMedicine.rows });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
