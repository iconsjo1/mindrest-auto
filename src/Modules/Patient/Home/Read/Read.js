module.exports = route => app => {
 // Read Patient[s]
 app.get(route, async (req, res) => {
  try {
   const {
    locals: {
     utils: { db, isPositiveInteger, orderBy, getLimitClause, ROLES },
     role_id,
     patient_id,
    },
   } = res;

   const patientClause = role_id === ROLES.PATIENTS ? `user_id= ${patient_id}` : '1=1';

   const { id, limit } = req.query;

   const { rows } = isPositiveInteger(id)
    ? await db.query('SELECT * FROM public."Patients" WHERE 1=1 AND id=$1 AND' + patientClause, [
       id,
      ])
    : await db.query(
       `SELECT * FROM public."Patients" WHERE ${patientClause} ${orderBy('id')} ${getLimitClause(
        limit
       )}`
      );

   res.json({
    success: true,
    no_of_records: rows.length,
    msg: `Patient${1 === rows.length ? ' was' : 's were'} retrieved successfully.`,
    data: rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
