module.exports = route => (app, db) => {
 // Update Doctor Reply
 app.put(route, async (req, res) => {
  try {
   const { db, isPositiveInteger } = res.locals.utils;
   const { id } = req.query;

   if (!isPositiveInteger(id))
    return res.repl(404).json({ Success: false, msg: 'Doctor reply not found.' });

   let i = 1;
   const changed = [];
   for (let prop in req.body) changed.push(`${prop} = $${i++}`);

   const { rows } = await db.query(
    `UPDATE public."Doctor_Replies" SET ${changed} WHERE 1=1 AND id=$${i} RETURNING *`,
    [...Object.values(req.body), id]
   );

   res.json({
    success: true,
    msg: 'Doctor reply updated successfully.',
    data: rows,
   });
  } catch ({ messge }) {
   res.json({ success: false, message });
  }
 });
};
