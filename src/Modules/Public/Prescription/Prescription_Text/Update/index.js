const { isPositiveInteger } = require('../../../../../Utils');

module.exports = route => (app, db) => {
 // Update prescription Text
 app.put(route, async (req, res) => {
  try {
   const { id } = req.query;
   if (!isPositiveInteger(id))
    return res.status(404).json({ Success: false, msg: 'Prescritpion text not found.' });

   const changed = [];

   let i = 1;
   for (let prop in req.body) changed.push(`${prop} = $${i++}`);

   const { rows } = await db.query(
    `UPDATE public."Prescription_Texts" SET ${changed} WHERE 1=1 AND id=$${i} RETURNING *`,
    [...Object.values(req.body), id]
   );

   res.json({ success: true, msg: 'Prescription text updated successfully.', data: rows });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
