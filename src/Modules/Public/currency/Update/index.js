const { isPositiveInteger } = require('../../../../Utils');

module.exports = route => (app, db) => {
 // Update Currency
 app.put(route, async (req, res) => {
  try {
   const { id } = req.query;
   if (!isPositiveInteger(id))
    return res.status(404).json({ Success: false, msg: 'Currency not found.' });

   const modifiedData = [];

   let i = 1;
   for (let prop in req.body) modifiedData.push(`${prop} = $${i++}`);

   const modifiedCurrency = await db.query(
    `UPDATE public."Currencies" SET ${modifiedData.join(',')} WHERE 1=1 AND id=$${i} RETURNING *`,
    [...Object.values(req.body), id]
   );

   res.json({ success: true, msg: 'Currency updated successfully.', data: modifiedCurrency.rows });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
