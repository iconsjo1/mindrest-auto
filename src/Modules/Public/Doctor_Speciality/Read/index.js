module.exports = (app, db) => {
 // Read Doctor Specialit[y|ies]
 app.get('/REST/doctor_specialities', async (req, res) => {
  try {
        
    const { db} = res.locals.utils;
    
   const { id } = req.query;

   const doctorSpecialities = id
    ? await db.query('SELECT * FROM public."Doctor_Specialities" WHERE 1=1 AND id=$1', [id])
    : await db.query('SELECT * FROM public."Doctor_Specialities"');

   res.json({
    success: true,
    msg: `Doctor specialit${
     1 === doctorSpecialities.rows.length ? 'y' : 'ies'
    } retrieved successfully.`,
    data: doctorSpecialities.rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
