module.exports = route => (app, db) => {
 // Create Service Category
 app.post(route, async (req, res) => {
  try {
   const fields = Object.keys(req.body);
   const values = Object.values(req.body);
   const enc_values = [];

   for (let i = 0; i < values.length; enc_values.push(`$${++i}`));

   const newServiceCategory = await db.query(
    `INSERT INTO public."Service_Categories"(${fields}) VALUES(${enc_values}) RETURNING *`,
    values
   );
   res.json({
    success: true,
    msg: 'Service category created successfully.',
    data: newServiceCategory.rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
