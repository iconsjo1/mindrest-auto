module.exports = route => (app, db) => {
 // Create Relationship
 app.post(route, async (req, res) => {
  try {
   const fields = Object.keys(req.body);
   const values = Object.values(req.body);
   const enc_values = [];

   for (let i = 0; i < values.length; enc_values.push(`$${++i}`));

   const newRelationship = await db.query(
    `INSERT INTO public."Relationships"(${fields}) VALUES(${enc_values}) RETURNING *`,
    values
   );

   res.json({
    success: true,
    msg: 'Relationship created successfully.',
    data: newRelationship.rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
