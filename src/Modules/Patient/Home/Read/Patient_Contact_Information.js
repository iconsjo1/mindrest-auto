module.exports = route => app => {
 // Read Patient Contact Information[s]
 app.get(route, async (req, res) => {
  try {
   //const { db, isPositiveInteger, getLimitClause } = res.locals.utils;

   const { id: patient_id, doctor_id, limit } = req.query;

   const {
    locals: {
     utils: { db, isPositiveInteger, getLimitClause, ROLES },
     role_id,
     doctor_id: id,
     therapist_id,
    },
   } = res;

   const Clause = [ROLES.THERAPIST, ROLES.DOCTOR].includes(role_id)
    ? 'id= ' + therapist_id ?? 'doctor_id =' + id
    : '1=1';

   const { rows } = isPositiveInteger(patient_id)
    ? await db.query(
       'SELECT * FROM public."V_Patient_Contact_Info" WHERE 1=1 AND patient_id=$1 AND ' + Clause,
       [patient_id]
      )
    : isPositiveInteger(doctor_id)
    ? await db.query(
       'SELECT * FROM public."V_Patient_Contact_Info" WHERE 1=1 AND doctor_id=$1 ' +
        Clause +
        getLimitClause(limit),
       [doctor_id]
      )
    : await db.query(
       'SELECT * FROM public."V_Patient_Contact_Info" ' + Clause + getLimitClause(limit)
      );

   res.json({
    success: true,
    no_of_records: rows.length,
    msg: `Patient contact information${
     1 === rows.length ? ' was' : 's were'
    } retrieved successfully.`,
    data: rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
