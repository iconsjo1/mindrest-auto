module.exports = route => app => {
 // Read Doctor Patients[s]
 app.get(route, async (req, res) => {
  try {
   const { doctor_id, patient_id, therapist, limit } = req.query;

   const {
    locals: {
     utils: { db, isPositiveInteger, getLimitClause, ROLES, isTherapist },
     role_id,
     doctor_id: id,
     therapist_id,
    },
   } = res;

   const clause = [ROLES.DOCTOR, ROLES.THERAPIST].includes(role_id)
    ? 'id=' + id ?? 'id= ' + therapist_id
    : '1=1';

   const { condition, msg } = isTherapist(therapist);

   const { rows } = isPositiveInteger(patient_id)
    ? await db.query(
       `SELECT * FROM public."V_Doctor_Patients" WHERE 1=1 AND patient_id=$1 AND ${condition} AND ${clause}`,
       [patient_id]
      )
    : isPositiveInteger(doctor_id)
    ? await db.query(
       `SELECT * FROM public."V_Doctor_Patients" WHERE 1=1 AND doctor_id=$1 AND ${condition} AND ${clause} ${getLimitClause(
        limit
       )}`,
       [doctor_id]
      )
    : await db.query(
       `SELECT * FROM public."V_Doctor_Patients" WHERE ${condition} AND ${clause}${getLimitClause(
        limit
       )}`
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
