module.exports = route => (app, db) => {
 // Read Patient Contact Information[s]
 app.get(route, async (req, res) => {
  try {
   const { id: patient_id, doctor_id } = req.query;
   const { db, isPositiveInteger } = res.locals.utils;

   const patientContactInfo = isPositiveInteger(patient_id)
    ? await db.query('SELECT * FROM public."V_Patient_Contact_Info" WHERE 1=1 AND patient_id=$1', [
       patient_id,
      ])
    : isPositiveInteger(doctor_id)
    ? await db.query('SELECT * FROM public."V_Patient_Contact_Info" WHERE 1=1 AND doctor_id=$1', [
       doctor_id,
      ])
    : await db.query('SELECT * FROM public."V_Patient_Contact_Info"');

   res.json({
    success: true,
    msg: `Patient contact information${
     1 === patientContactInfo.rows.length ? '' : 's'
    } retrieved successfully.`,
    data: patientContactInfo.rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
