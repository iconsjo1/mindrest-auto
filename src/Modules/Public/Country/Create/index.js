module.exports = (app, db) => {
 // Create Country
 app.post('/REST/countries', async (req, res) => {
  try {
   const fields = Object.keys(req.body);
   const values = Object.values(req.body);
   const enc_values = [];

   for (let i = 0; i < values.length; enc_values.push(`$${++i}`));
   const newCountry = await db.query(
    `INSERT INTO public."Countries"(${fields}) VALUES(${enc_values}) RETURNING *`,
    values
   );

   res.json({ success: true, msg: 'Country created successfully.', data: newCountry.rows });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
