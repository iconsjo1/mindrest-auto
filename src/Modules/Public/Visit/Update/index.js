module.exports = route => app => {
 // Update Visit
 app.put(route, async (req, res) => {
  const { db, isPositiveInteger } = res.locals.utils;
  try {
   const { id } = req.query;
   if (!isPositiveInteger(id))
    return res.status(404).json({ Success: false, msg: 'Visit was not found.' });

   const changed = [];
   let i = 1;

   for (let prop in req.body) changed.push(`${prop} = $${i++}`);

   const { rows } = await db.query(
    `UPDATE public."Visits" SET ${changed.join(',')} WHERE 1=1 AND id=$${i} RETURNING *`,
    [...Object.values(req.body), id]
   );
   res.json({ success: true, msg: 'Visit was updated successfully.', data: rows });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
