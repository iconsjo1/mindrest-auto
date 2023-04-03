const { isPositiveInteger } = require('../../../../Utils');

module.exports = route => (app, db) => {
 // Update Expense Category
 app.put(route, async (req, res) => {
  try {
   const { id } = req.query;
   if (!isPositiveInteger(id))
    return res.status(404).json({ Success: false, msg: 'Expense category not found.' });
   const modifiedData = [];

   let i = 1;
   for (let prop in req.body) modifiedData.push(`${prop} = $${i++}`);

   const { rows } = await db.query(
    `UPDATE public."Expense_Categories" SET ${modifiedData.join(
     ','
    )} WHERE 1=1 AND id=$${i} RETURNING *`,
    [...Object.values(req.body), id]
   );
   res.json({
    success: true,
    msg: 'Expense category updated successfully.',
    data: rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
