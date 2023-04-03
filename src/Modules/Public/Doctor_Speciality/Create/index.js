module.exports = (app, db) => {
 // Create Doctor Speciality
 app.post('/REST/doctor_specialities', async (req, res) => {
  try {
   const fields = Object.keys(req.body).join(',');
   const values = Object.values(req.body);
   const enc_values = [];

   for (let i = 0; i < values.length; enc_values.push(`$${++i}`));

   const newDoctorSpeciality = await db.query(
    `INSERT INTO public."Doctor_Specialities"(${fields}) VALUES(${enc_values.join(
     ','
    )}) RETURNING *`,
    values
   );
   res.json({
    success: true,
    msg: 'Doctor speciality created successfully.',
    data: newDoctorSpeciality.rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
