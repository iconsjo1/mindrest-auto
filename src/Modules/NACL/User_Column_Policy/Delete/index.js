module.exports = (app, db) => {
 // Delete User Column Policy
 app.delete('/REST/user_column_policies', async (req, res) => {
  try {
   const { id } = req.query;
   if (!id) return res.status(404).json({ success: false, msg: 'User column policy not found.' });

   const deletedUserColumnPolicy = await db.query(
    'DELETE FROM nacl."User_Column_Policies" WHERE 1=1 AND id = $1 RETURNING *',
    [id]
   );

   res.json({
    Success: true,
    msg: 'User column policy deleted successfully.',
    data: deletedUserColumnPolicy.rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
