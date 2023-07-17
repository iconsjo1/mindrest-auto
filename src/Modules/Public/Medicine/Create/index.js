module.exports = (app, db) => {
 // Create Medicine
 app.post('/REST/medicines', async (req, res) => {
  try {
   const fields = Object.keys(req.body);
   const values = Object.values(req.body);
   const enc_values = [];

   for (let i = 0; i < values.length; enc_values.push(`$${++i}`));

   const newMedicine = await db.query(
    `INSERT INTO public."Medicines"(${fields}) VALUES(${enc_values}) RETURNING *`,
    values
   );
   res.json({ success: true, msg: 'Medicine created successfully.', data: newMedicine.rows });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
