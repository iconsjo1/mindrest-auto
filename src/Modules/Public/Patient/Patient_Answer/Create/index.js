module.exports = route => (app, db) => {
 // Create Patient Answer
 app.post(route, async (req, res) => {
  try {
   const fields = Object.keys(req.body).join(',');
   const values = Object.values(req.body);
   const enc_values = [];

   for (let i = 0; i < values.length; enc_values.push(`$${++i}`));

   const newPatientAnswer = await db.query(
    `INSERT INTO public."Patient_Answers"(${fields}) VALUES(${enc_values.join(',')}) RETURNING *`,
    values
   );
   res.json({
    success: true,
    msg: 'Patient answer created successfully.',
    data: newPatientAnswer.rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
