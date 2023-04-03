module.exports = (app, db) => {
 // Delete Sys_User
 app.delete('/REST/sys_users', async (req, res) => {
  try {
   const { id } = req.query;
   if (!id) return res.status(404).json({ success: false, msg: 'User not found.' });

   const deletedUser = await db.query(
    'DELETE FROM nacl."Users" WHERE 1=1 AND id = $1 RETURNING *',
    [id]
   );

   res.json({ Success: true, msg: 'User deleted successfully.', data: deletedUser.rows });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
