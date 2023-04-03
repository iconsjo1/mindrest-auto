module.exports = (app, db) => {
 // Create Lab Test
 app.post('/REST/lab_tests', async (req, res) => {
  try {
   const fields = Object.keys(req.body).join(',');
   const values = Object.values(req.body);
   const enc_values = [];

   for (let i = 0; i < values.length; enc_values.push(`$${++i}`));

   const newLabTest = await db.query(
    `INSERT INTO public."Lab_Tests"(${fields}) VALUES(${enc_values.join(',')}) RETURNING *`,
    values
   );
   res.json({ success: true, msg: 'Lab test created successfully.', data: newLabTest.rows });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
