module.exports = (app, db) => {
 // Delete Group
 app.delete('/REST/groups', async (req, res) => {
  try {
   const { id } = req.query;
   if (!id) return res.status(404).json({ success: false, msg: 'Group not found.' });

   const deletedGroup = await db.query(
    'DELETE FROM nacl."Groups" WHERE 1=1 AND id = $1 RETURNING *',
    [id]
   );

   res.json({ Success: true, msg: 'Group deleted successfully.', data: deletedGroup.rows });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
