const { isPositiveInteger } = require('../../../../Utils');

module.exports = route => (app, db) => {
 // Delete Hall
 app.delete(route, async (req, res) => {
  try {
   const { id } = req.query;
   if (!isPositiveInteger(id))
    return res.status(404).json({ success: false, msg: 'Hall not found.' });

   const deletedHall = await db.query(
    'DELETE FROM public."Halls" WHERE 1=1 AND id = $1 RETURNING *',
    [id]
   );

   res.json({ Success: true, msg: 'Hall deleted successfully.', data: deletedHall.rows });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
