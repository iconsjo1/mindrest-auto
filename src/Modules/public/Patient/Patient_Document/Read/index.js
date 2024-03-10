module.exports = route => app => {
 // Read Patient Document[s]
 app.get(route, async (req, res) => {
  try {
   const {
    locals: {
     utils: { db, isPositiveInteger, getLimitClause, ROLES },
     role_id,
     patient_id: dbpatient_id,
    },
   } = res;

   const patientClause = ROLES.PATIENT === role_id ? 'patient_id= ' + dbpatient_id : '1=1';

   const { patient_id, limit = -1 } = req.query;

   const { rows } = isPositiveInteger(patient_id)
    ? await db.query('SELECT * FROM public."V_Patient_Documents" WHERE 1=1 AND patient_id=$1 AND ' + patientClause, [
       patient_id,
      ])
    : await db.query(
       'SELECT * FROM public."V_Patient_Documents" WHERE 1=1 AND ' + patientClause + getLimitClause(limit)
      );

   res.json({
    success: true,
    no_of_records: rows.length,
    msg: `Patient document${1 === rows.length ? ' was' : 's were'} retrieved successfully.`,
    data: rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
