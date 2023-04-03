module.exports = route => (app, db) => {
 // Read Doctor Patients[s]
 app.get(route, async (req, res) => {
  try {
   const { doctor_id, patient_id, therapist, limit } = req.query;

   const { db, isPositiveInteger, getLimitClause, isTherapist } = res.locals.utils;
   const { condition, msg } = isTherapist(therapist);

   const { rows } = isPositiveInteger(patient_id)
    ? await db.query(
       `SELECT * FROM public."V_Doctor_Patients" WHERE 1=1 AND patient_id=$1 AND ${condition}`,
       [patient_id]
      )
    : isPositiveInteger(doctor_id)
    ? await db.query(
       `SELECT * FROM public."V_Doctor_Patients" WHERE 1=1 AND doctor_id=$1 AND ${condition}`,
       [doctor_id]
      )
    : await db.query(
       `SELECT * FROM public."V_Doctor_Patients" WHERE ${condition} ${getLimitClause(limit)}`
      );

   res.json({
    success: true,
    no_of_records: rows.length,
    msg: `${msg}Doctor patient${1 === rows.length ? '' : 's'} retrieved successfully.`,
    data: rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
