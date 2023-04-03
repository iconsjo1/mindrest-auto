module.exports = (app, db) => {
 // Delete User Table Policy
 app.delete('/REST/user_table_policies', async (req, res) => {
  try {
   const { id } = req.query;
   if (!id) return res.status(404).json({ success: false, msg: 'User table policy not found.' });

   const deletedUserTablePolicy = await db.query(
    'DELETE FROM nacl."User_Table_Policies" WHERE 1=1 AND id = $1 RETURNING *',
    [id]
   );

   res.json({
    Success: true,
    msg: 'User table policy deleted successfully.',
    data: deletedUserTablePolicy.rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
