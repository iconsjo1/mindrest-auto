module.exports = (app, db) => {
 // Update Group
 app.put('/REST/groups', async (req, res) => {
  try {
   const { id } = req.query;
   if (!id) return res.status(404).json({ Success: false, msg: 'Group not found.' });
   const changed = [];

   let i = 1;
   for (let prop in req.body) changed.push(`${prop} = $${i++}`);

   const modifieGroup = await db.query(
    `UPDATE nacl."Groups" SET ${changed} WHERE 1=1 AND id=$${i} RETURNING *`,
    [...Object.values(req.body), id]
   );
   res.json({
    success: true,
    msg: 'Group updated successfully.',
    data: modifieGroup.rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
