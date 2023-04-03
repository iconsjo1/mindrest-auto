module.exports = route => (app, db) => {
 // Create City
 app.post(route, async (req, res) => {
  try {
   const fields = Object.keys(req.body).join(',');
   const values = Object.values(req.body);
   const enc_values = [];

   for (let i = 0; i < values.length; enc_values.push(`$${++i}`));
   const newCity = await db.query(
    `INSERT INTO public."Cities"(${fields}) VALUES(${enc_values.join(',')}) RETURNING *`,
    values
   );

   res.json({ success: true, msg: 'City created successfully.', data: newCity.rows });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
