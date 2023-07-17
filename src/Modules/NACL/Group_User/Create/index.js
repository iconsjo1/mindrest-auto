module.exports = (app, db) => {
 // Create Group User
 app.post('/REST/group_users', async (req, res) => {
  try {
   const fields = Object.keys(req.body);
   const values = Object.values(req.body);
   const enc_values = [];

   for (let i = 0; i < values.length; enc_values.push(`$${++i}`));

   const newGroupUser = await db.query(
    `INSERT INTO nacl."Group_Users"(${fields}) VALUES(${enc_values}) RETURNING *`,
    values
   );
   res.json({ success: true, msg: 'Group user created successfully.', data: newGroupUser.rows });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
