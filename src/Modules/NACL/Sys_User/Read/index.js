module.exports = (app, db) => {
 // Read Sys_User[s]
 app.get('/REST/sys_users', async (req, res) => {
  try {
   const { id } = req.query;

   const Users = id
    ? await db.query('SELECT * FROM nacl."Users" WHERE 1=1 AND id=$1', [id])
    : await db.query('SELECT * FROM nacl."Users"');

   res.json({
    success: true,
    msg: `User${1 === Users.rows.length ? '' : 's'} retrieved successfully.`,
    data: Users.rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
