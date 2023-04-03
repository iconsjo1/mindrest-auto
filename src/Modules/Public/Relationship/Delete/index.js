const { isPositiveInteger } = require('../../../../Utils');

module.exports = route => (app, db) => {
 // Delete Relationship
 app.delete(route, async (req, res) => {
  try {
   const { id } = req.query;
   if (!isPositiveInteger(id))
    return res.status(404).json({ success: false, msg: 'Relationship not found.' });

   const deletedRelationship = await db.query(
    'DELETE FROM public."Relationships" WHERE 1=1 AND id = $1 RETURNING *',
    [id]
   );

   res.json({
    Success: true,
    msg: 'Relationship deleted successfully.',
    data: deletedRelationship.rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
