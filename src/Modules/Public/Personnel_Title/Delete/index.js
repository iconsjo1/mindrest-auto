module.exports = route => (app, db) => {
 // Delete Personnel Title
 app.delete(route, async (req, res) => {
  try {
   const { id } = req.query;
   if (!id) return res.status(404).json({ success: false, msg: 'Personnel title not found.' });

   const deletedPersonneltitle = await db.query(
    'DELETE FROM public."Personnel_Titles" WHERE 1=1 AND id = $1 RETURNING *',
    [id]
   );

   res.json({
    Success: true,
    msg: 'Personnel title deleted successfully.',
    data: deletedPersonneltitle.rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
