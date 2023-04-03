module.exports = (app, db) => {
 // Delete Group Column Policy
 app.delete('/REST/group_column_policies', async (req, res) => {
  try {
   const { id } = req.query;
   if (!id) return res.status(404).json({ success: false, msg: 'Group column policy not found.' });

   const deletedGroupColumnPolicy = await db.query(
    'DELETE FROM nacl."Group_Column_Policies" WHERE 1=1 AND id = $1 RETURNING *',
    [id]
   );

   res.json({
    Success: true,
    msg: 'Group column policy deleted successfully.',
    data: deletedGroupColumnPolicy.rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
