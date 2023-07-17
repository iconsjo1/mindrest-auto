module.exports = route => (app, db) => {
 // Create Patient Deposite
 app.post(route, async (req, res) => {
  try {
   const fields = Object.keys(req.body);
   const values = Object.values(req.body);
   const enc_values = [];

   for (let i = 0; i < values.length; enc_values.push(`$${++i}`));

   const newPatientDeposite = await db.query(
    `INSERT INTO public."Patient_Deposites"(${fields}) VALUES(${enc_values}) RETURNING *`,
    values
   );

   res.json({
    success: true,
    msg: 'Patient deposite created successfully.',
    data: newPatientDeposite.rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
