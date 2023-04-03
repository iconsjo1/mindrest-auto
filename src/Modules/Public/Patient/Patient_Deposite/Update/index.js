const { isPositiveInteger } = require('../../../../../Utils');

module.exports = route => (app, db) => {
 // Update Patient Deposite
 app.put(route, async (req, res) => {
  try {
   const { id } = req.query;
   if (!isPositiveInteger(id))
    return res.status(404).json({ Success: false, msg: 'Patient deposite not found.' });

   const modifiedData = [];

   let i = 1;
   for (let prop in req.body) modifiedData.push(`${prop} = $${i++}`);

   const modifiedBill = await db.query(
    `UPDATE public."Patient_Deposites" SET ${modifiedData.join(
     ','
    )} WHERE 1=1 AND id=$${i} RETURNING *`,
    [...Object.values(req.body), id]
   );

   res.json({
    success: true,
    msg: 'Patient deposite updated successfully.',
    data: modifiedBill.rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
