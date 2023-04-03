const { isPositiveInteger } = require('../../../../Utils');
module.exports = route => (app, db) => {
 // Delete Currency
 app.delete(route, async (req, res) => {
  try {
   const { id } = req.query;
   if (!isPositiveInteger(id))
    return res.status(404).json({ success: false, msg: 'Currency not found.' });

   const deletedCurrency = await db.query(
    'DELETE FROM public."Currencies" WHERE 1=1 AND id = $1 RETURNING *',
    [id]
   );

   res.json({ Success: true, msg: 'Currency deleted successfully.', data: deletedCurrency.rows });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
