module.exports = (app, db) => {
 // Create Lab
 app.post('/REST/labs', async (req, res) => {
  try {
   const fields = Object.keys(req.body).join(',');
   const values = Object.values(req.body);
   const enc_values = [];

   for (let i = 0; i < values.length; enc_values.push(`$${++i}`));

   const newLab = await db.query(
    `INSERT INTO public."Labs"(${fields}) VALUES(${enc_values.join(',')}) RETURNING *`,
    values
   );
   res.json({ success: true, msg: 'Lab created successfully.', data: newLab.rows });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
