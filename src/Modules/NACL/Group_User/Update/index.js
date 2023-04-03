module.exports = (app, db) => {
 // Update Group User
 app.put('/REST/group_users', async (req, res) => {
  try {
   const { id } = req.query;
   if (!id) return res.status(404).json({ Success: false, msg: 'Group not found.' });
   const modifiedData = [];

   let i = 1;
   for (let prop in req.body) modifiedData.push(`${prop} = $${i++}`);

   const modifieGroup = await db.query(
    `UPDATE nacl."Group_Users" SET ${modifiedData.join(',')} WHERE 1=1 AND id=$${i} RETURNING *`,
    [...Object.values(req.body), id]
   );
   res.json({
    success: true,
    msg: 'Group user updated successfully.',
    data: modifieGroup.rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
