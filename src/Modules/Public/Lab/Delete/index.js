module.exports = (app, db) => {
 // Delete Lab
 app.delete('/REST/labs', async (req, res) => {
  try {
   const { id } = req.query;
   if (!id) return res.status(404).json({ success: false, msg: 'Lab not found.' });

   const deletedLab = await db.query(
    'DELETE FROM public."Labs" WHERE 1=1 AND id = $1 RETURNING *',
    [id]
   );

   res.json({ Success: true, msg: 'Lab deleted successfully.', data: deletedLab.rows });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
