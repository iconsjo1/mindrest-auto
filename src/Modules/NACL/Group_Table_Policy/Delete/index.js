module.exports = (app, db) => {
 // Delete Group Table Policy
 app.delete('/REST/group_table_policies', async (req, res) => {
  try {
   const { id } = req.query;
   if (!id) return res.status(404).json({ success: false, msg: 'Group table policy not found.' });

   const deletedGroupTablePolicy = await db.query(
    'DELETE FROM nacl."Group_Table_Policies" WHERE 1=1 AND id = $1 RETURNING *',
    [id]
   );

   res.json({
    Success: true,
    msg: 'Group table policy deleted successfully.',
    data: deletedGroupTablePolicy.rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
