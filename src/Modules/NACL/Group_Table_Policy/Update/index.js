module.exports = (app, db) => {
 // Update Group Table Policy
 app.put('/REST/group_table_policies', async (req, res) => {
  try {
   const { id } = req.query;
   if (!id) return res.status(404).json({ Success: false, msg: 'Group table policy not found.' });
   const modifiedData = [];

   let i = 1;
   for (let prop in req.body) modifiedData.push(`${prop} = $${i++}`);

   const modifiedGroupTablePolicy = await db.query(
    `UPDATE nacl."Group_Table_Policies" SET ${modifiedData.join(
     ','
    )} WHERE 1=1 AND id=$${i} RETURNING *`,
    [...Object.values(req.body), id]
   );
   res.json({
    success: true,
    msg: 'Group updated successfully.',
    data: modifiedGroupTablePolicy.rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
