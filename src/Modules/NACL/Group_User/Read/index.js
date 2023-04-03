module.exports = (app, db) => {
 // Read Group User[s]
 app.get('/REST/group_users', async (req, res) => {
  try {
   const { id } = req.query;

   const groupUsers = id
    ? await db.query('SELECT * FROM nacl."Group_Users" WHERE 1=1 AND id=$1', [id])
    : await db.query('SELECT * FROM nacl."Group_Users"');

   res.json({
    success: true,
    msg: `Group user${1 === groupUsers.rows.length ? '' : 's'} retrieved successfully.`,
    data: groupUsers.rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
