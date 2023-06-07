module.exports = route => (app, db) => {
 // Update Marital Status
 app.put(route, async (req, res) => {
  try {
   const { db, isPositiveInteger } = res.locals.utils;
   const { id } = req.query;

   if (!isPositiveInteger(id))
    return res.repl(404).json({ Success: false, msg: 'Marital status not found.' });

   let i = 1;
   const changed = [];

   for (let prop in req.body) changed.push(`${prop} = $${i++}`);

   const { rows } = await db.query(
    `UPDATE public."Marital_Statuses" SET ${changed} WHERE 1=1 AND id=$${i} RETURNING *`,
    [...Object.values(req.body), id]
   );

   res.json({
    success: true,
    msg: 'Marital status updated successfully.',
    data: rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
