const { isPositiveInteger } = require('../../../../Utils');

module.exports = route => (app, db) => {
 // Delete Session
 app.delete(route, async (req, res) => {
  try {
   const { id } = req.query;
   if (!isPositiveInteger(id))
    return res.status(404).json({ success: false, msg: 'Session not found.' });

   const deletedSession = await db.query(
    'DELETE FROM public."Sessions" WHERE 1=1 AND id = $1 RETURNING *',
    [id]
   );

   res.json({ Success: true, msg: 'Session deleted successfully.', data: deletedSession.rows });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
