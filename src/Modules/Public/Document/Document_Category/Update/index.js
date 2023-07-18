module.exports = route => (app, db) => {
 // Update Document Category
 app.put(route, async (req, res) => {
  try {
   const { db, isPositiveInteger } = res.locals.utils;

   const { id } = req.query;
   if (!isPositiveInteger(id))
    return res.status(404).json({ Success: false, msg: 'Document category not found.' });

   let i = 1;
   const changed = [];
   for (let prop in req.body) changed.push(`${prop} = $${i++}`);

   const { rows } = await db.query(
    `UPDATE public."Document_Categories" SET ${changed} WHERE 1=1 AND id=$${i} RETURNING *`,
    [...Object.values(req.body), id]
   );
   res.json({
    success: true,
    msg: 'Document category updated successfully.',
    data: rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
