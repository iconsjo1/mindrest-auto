module.exports = route => app => {
 // Update Role
 app.put(route, async (req, res) => {
  const { db, isPositiveInteger } = res.locals.utils;
  try {
   const { id } = req.query;
   if (!isPositiveInteger(id))
    return res.status(404).json({ Success: false, msg: 'Role was not found.' });

   const changed = [];
   let i = 1;

   for (let prop in req.body) changed.push(`${prop} = $${i++}`);

   const { rows } = await db.query(
    `UPDATE public."Roles" SET ${changed} WHERE 1=1 AND id=$${i} RETURNING *`,
    [...Object.values(req.body), id]
   );
   res.json({ success: true, msg: 'Role was updated successfully.', data: rows });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
