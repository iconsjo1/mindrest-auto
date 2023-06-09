const { isPositiveInteger } = require('../../../../../Utils');

module.exports = route => (app, db) => {
 // Delete Prescription Medicine[s]
 app.delete(route, async (req, res) => {
  try {
   const { prescription_id: id } = req.query;
   if (!isPositiveInteger(id))
    return res.status(404).json({ success: false, msg: 'Prescription medicine not found.' });

   const { rows } = await db.query(
    'DELETE FROM public."Prescription_Medicines" WHERE 1=1 AND prescription_id = $1 RETURNING *',
    [id]
   );

   res.json({
    Success: true,
    msg: 'Prescription medicine deleted successfully.',
    data: rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
