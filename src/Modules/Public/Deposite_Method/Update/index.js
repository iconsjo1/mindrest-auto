module.exports = route => (app, db) => {
 // Update Deposite Method
 app.put(route, async (req, res) => {
  try {
   const { db } = res.locals.utils;

   const { id } = req.query;
   if (!id) return res.status(404).json({ Success: false, msg: 'Deposite method not found.' });
   const changed = [];

   let i = 1;
   for (let prop in req.body) changed.push(`${prop} = $${i++}`);

   const depositeMethod = await db.query(
    `UPDATE public."Deposite_Methods" SET ${changed} WHERE 1=1 AND id=$${i} RETURNING *`,
    [...Object.values(req.body), id]
   );
   res.json({
    success: true,
    msg: 'Deposite method updated successfully.',
    data: depositeMethod.rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
