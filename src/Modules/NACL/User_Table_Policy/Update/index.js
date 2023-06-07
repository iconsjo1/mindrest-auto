module.exports = (app, db) => {
 // Update User Table Policy
 app.put('/REST/user_table_policies', async (req, res) => {
  try {
   const { id } = req.query;
   if (!id) return res.status(404).json({ Success: false, msg: 'User table policy not found.' });
   const changed = [];

   let i = 1;
   for (let prop in req.body) changed.push(`${prop} = $${i++}`);

   const modifiedUserTablePolicy = await db.query(
    `UPDATE nacl."User_Table_Policies" SET ${changed} WHERE 1=1 AND id=$${i} RETURNING *`,
    [...Object.values(req.body), id]
   );
   res.json({
    success: true,
    msg: 'User updated successfully.',
    data: modifiedUserTablePolicy.rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
