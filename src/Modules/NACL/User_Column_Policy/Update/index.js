module.exports = (app, db) => {
 // Update User Column Policy
 app.put('/REST/user_column_policies', async (req, res) => {
  try {
   const { id } = req.query;
   if (!id) return res.status(404).json({ Success: false, msg: 'User column policy not found.' });
   const modifiedData = [];

   let i = 1;
   for (let prop in req.body) modifiedData.push(`${prop} = $${i++}`);

   const modifiedUserColumnPolicy = await db.query(
    `UPDATE nacl."User_Column_Policies" SET ${modifiedData.join(
     ','
    )} WHERE 1=1 AND id=$${i} RETURNING *`,
    [...Object.values(req.body), id]
   );
   res.json({
    success: true,
    msg: 'User updated successfully.',
    data: modifiedUserColumnPolicy.rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
