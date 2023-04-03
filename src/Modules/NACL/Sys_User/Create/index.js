module.exports = (app, db) => {
 // Create Sys_User
 app.post('/REST/sys_users', async (req, res) => {
  try {
   const fields = Object.keys(req.body).join(',');
   const values = Object.values(req.body);
   const enc_values = [];

   for (let i = 0; i < values.length; enc_values.push(`$${++i}`));

   const newUser = await db.query(
    `INSERT INTO nacl."Users"(${fields}) VALUES(${enc_values.join(',')}) RETURNING *`,
    values
   );
   res.json({ success: true, msg: 'User created successfully.', data: newUser.rows });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
