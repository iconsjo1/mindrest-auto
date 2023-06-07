module.exports = route => (app, db) => {
 // Update User
 app.put(route, async (req, res) => {
  try {
   const { id } = req.query;
   if (!id) return res.status(404).json({ Success: false, msg: 'User not found.' });

   const changed = [];

   let i = 1;
   for (let prop in req.body) changed.push(`${prop} = $${i++}`);

   const modifiedUser = await db.query(
    `UPDATE public."Users" SET ${changed} WHERE 1=1 AND id=$${i} RETURNING *`,
    [...Object.values(req.body), id]
   );

   res.json({ success: true, msg: 'User updated successfully.', data: modifiedUser.rows });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
