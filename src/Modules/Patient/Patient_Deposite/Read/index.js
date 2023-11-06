module.exports = route => app => {
 // Read Patient Deposite[s]
 app.get(route, async (req, res) => {
  try {
   const {
    locals: {
     utils: { db, isPositiveInteger, orderBy, getLimitClause, ROLES },
     role_id,
     patient_id,
    },
   } = res;

   const clause = ROLES.PATIENT === role_id ? 'patient_id= ' + patient_id : '1=1';

   const { patient_id: id, limit } = req.query;

   const { rows } = isPositiveInteger(id)
    ? await db.query('SELECT * FROM public."Patient_Deposites" WHERE 1=1 AND patient_id=$1 AND ' + clause, [id])
    : await db.query(
       `SELECT * FROM public."Patient_Deposites"
        WHERE 1=1
        AND ${clause}
        ${orderBy('id')}
        ${getLimitClause(limit)}`.replace(/\s+/g, ' ')
      );

   res.json({
    success: true,
    no_of_records: rows.length,
    msg: `Patient deposite${1 === rows.length ? ' was' : 's were'} retrieved successfully.`,
    data: rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
