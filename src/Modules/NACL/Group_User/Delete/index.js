module.exports = (app, db) => {
 // Delete Group User
 app.delete('/REST/group_users', async (req, res) => {
  try {
   const { id } = req.query;
   if (!id) return res.status(404).json({ success: false, msg: 'Group user not found.' });

   const deletedGroupUser = await db.query(
    'DELETE FROM nacl."Group_Users" WHERE 1=1 AND id = $1 RETURNING *',
    [id]
   );

   res.json({
    Success: true,
    msg: 'Group user deleted successfully.',
    data: deletedGroupUser.rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
