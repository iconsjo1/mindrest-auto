module.exports = route => (app, db) => {
 // Create Personnel Title
 app.post(route, async (req, res) => {
  try {
   const fields = Object.keys(req.body).join(',');
   const values = Object.values(req.body);
   const enc_values = [];

   for (let i = 0; i < values.length; enc_values.push(`$${++i}`));

   const newPersonnelTitle = await db.query(
    `INSERT INTO public."Personnel_Titles"(${fields}) VALUES(${enc_values.join(',')}) RETURNING *`,
    values
   );
   res.json({
    success: true,
    msg: 'Personnel title created successfully.',
    data: newPersonnelTitle.rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
