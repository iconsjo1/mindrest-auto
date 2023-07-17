module.exports = (app, db) => {
 // Create Group
 app.post('/REST/groups', async (req, res) => {
  try {
   const fields = Object.keys(req.body);
   const values = Object.values(req.body);
   const enc_values = [];

   for (let i = 0; i < values.length; enc_values.push(`$${++i}`));

   const newGroup = await db.query(
    `INSERT INTO nacl."Groups"(${fields}) VALUES(${enc_values}) RETURNING *`,
    values
   );
   res.json({ success: true, msg: 'Group created successfully.', data: newGroup.rows });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
