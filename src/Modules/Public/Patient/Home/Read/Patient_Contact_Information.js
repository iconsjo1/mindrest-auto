module.exports = route => (app, db) => {
 // Read Patient Contact Information[s]
 app.get(route, async (req, res) => {
  try {
   const { db, isPositiveInteger, getLimitClause } = res.locals.utils;

   const { id: patient_id, doctor_id, limit } = req.query;

   const { rows } = isPositiveInteger(patient_id)
    ? await db.query('SELECT * FROM public."V_Patient_Contact_Info" WHERE 1=1 AND patient_id=$1', [
       patient_id,
      ])
    : isPositiveInteger(doctor_id)
    ? await db.query(
       'SELECT * FROM public."V_Patient_Contact_Info" WHERE 1=1 AND doctor_id=$1 ' +
        getLimitClause(limit),
       [doctor_id]
      )
    : await db.query('SELECT * FROM public."V_Patient_Contact_Info" ' + getLimitClause(limit));

   res.json({
    success: true,
    no_of_records: rows.length,
    msg: `Patient contact information${
     1 === rows.length ? ' was' : 's were'
    } retrieved successfully.`,
    data: patientContactInfo.rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
