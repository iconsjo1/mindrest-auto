module.exports = route => (app, db) => {
 // Delete Holiday
 app.delete(route, async (req, res) => {
  try {
   const { id } = req.query;
   if (!id) return res.status(404).json({ success: false, msg: 'Holiday not found.' });

   const deletedHoliday = await db.query(
    'DELETE FROM public."Holidays" WHERE 1=1 AND id = $1 RETURNING *',
    [id]
   );

   res.json({ Success: true, msg: 'Holiday deleted successfully.', data: deletedHoliday.rows });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
