module.exports = route => app => {
 // Read Patient Contact Information[s]
 app.get(route, async (req, res) => {
  try {
   const { id: patient_id, doctor_id, limit } = req.query;

   const {
    locals: {
     utils: { db, isPositiveInteger, getLimitClause, ROLES },
     role_id,
     doctor_id: id,
     therapist_id,
     patient_id: pid,
    },
   } = res;
   const clause = (r => {
    switch (r) {
     case ROLES.DOCTOR:
      return `doctor_id=  '${id}'`;
     case ROLES.THERAPIST:
      return `doctor_id= '${therapist_id}'`;
     case ROLES.PATIENT:
      return `patient_id= '${pid}'`;
     default:
      return '1=1';
    }
   })(role_id);

   const { rows } = isPositiveInteger(patient_id)
    ? await db.query('SELECT * FROM public."V_Patient_Contact_Info" WHERE 1=1 AND patient_id=$1 AND ' + clause, [
       patient_id,
      ])
    : isPositiveInteger(doctor_id)
    ? await db.query(
       `SELECT * FROM public."V_Patient_Contact_Info" WHERE 1=1 AND doctor_id=$1 AND ${clause}
        ${getLimitClause(limit)}`,
       [doctor_id]
      )
    : await db.query(`SELECT * FROM public."V_Patient_Contact_Info" WHERE ${clause} ${getLimitClause(limit)}`);

   res.json({
    success: true,
    no_of_records: rows.length,
    msg: `Patient contact information${1 === rows.length ? ' was' : 's were'} retrieved successfully.`,
    data: rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
