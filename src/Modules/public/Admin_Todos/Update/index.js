module.exports = route => app => {
 // Update Admin_Todos
 app.put(route, async (req, res) => {
  try {
   const { db, isPositiveInteger } = res.locals.utils;

   const { id } = req.query;
   if (!isPositiveInteger(id)) return res.status(404).json({ Success: false, msg: 'Admin todo was not found.' });

   let i = 1;
   const changed = [];
   for (let prop in req.body) changed.push(`"${prop}" = $${i++}`);
   console.log(`UPDATE public."Admin_Todos" SET ${changed} WHERE 1=1 AND id=$${i} RETURNING *`);
   const { rows } = await db.query(`UPDATE public."Admin_Todos" SET ${changed} WHERE 1=1 AND id=$${i} RETURNING *`, [
    ...Object.values(req.body),
    id,
   ]);

   res.json({ success: true, msg: 'Admin todo was updated successfully.', data: rows });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
