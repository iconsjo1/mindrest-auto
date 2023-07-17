module.exports = route => (app, db) => {
 // Create Patient Document
 app.post(route, async (req, res) => {
  try {
   const fields = Object.keys(req.body);
   const values = Object.values(req.body);
   const enc_values = [];

   for (let i = 0; i < values.length; enc_values.push(`$${++i}`));

   const newPatientDocument = await db.query(
    `INSERT INTO public."Patient_Documents"(${fields}) VALUES(${enc_values}) RETURNING *`,
    values
   );
   res.json({
    success: true,
    msg: 'Patient document created successfully.',
    data: newPatientDocument.rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
