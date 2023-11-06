module.exports = route => app => {
 // Read Prescription[s] doctor_id
 app.get(route, async (req, res) => {
  try {
   const {
    locals: {
     utils: { db, isPositiveInteger, ROLES, orderBy, getLimitClause },
     role_id,
     doctor_id,
     patient_id,
     therapist_id,
    },
   } = res;
   const clause = (r => {
    switch (r) {
     case ROLES.DOCTOR:
      return 'doctor_id= ' + doctor_id;
     case ROLES.THERAPIST:
      return 'doctor_id= ' + therapist_id;
     case ROLES.PATIENT:
      return 'patient_id= ' + patient_id;
     default:
      return '1=1';
    }
   })(role_id);

   const { id, limit } = req.query;

   const { rows } = isPositiveInteger(id)
    ? await db.query(`SELECT * FROM public."Prescriptions" WHERE 1=1 AND ${clause} AND id=$1`, [id])
    : await db.query(
       `SELECT * FROM public."Prescriptions" WHERE 1=1 AND ${clause}   ${orderBy('id')} ${getLimitClause(limit)}`
      );

   res.json({
    success: true,
    no_of_records: rows.length,
    msg: `Prescription${1 === rows.length ? ' was' : 's were'} retrieved successfully.`,
    data: rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
