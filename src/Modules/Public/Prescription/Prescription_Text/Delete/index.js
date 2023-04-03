const { isPositiveInteger } = require('../../../../../Utils');

module.exports = route => (app, db) => {
 // Delete Prescription
 app.delete(route, async (req, res) => {
  try {
   const { id } = req.query;
   if (!isPositiveInteger(id))
    return res.status(404).json({ success: false, msg: 'Prescription text not found.' });

   const { rows } = await db.query(
    'DELETE FROM public."Prescription_Texts" WHERE 1=1 AND id = $1 RETURNING *',
    [id]
   );

   res.json({ Success: true, msg: 'Prescription text deleted successfully.', data: rows });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
