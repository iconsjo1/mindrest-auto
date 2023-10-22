module.exports = route => app => {
 // Read Patient Deposite[s]
 app.get(route, async (req, res) => {
  try {
   const {
    locals: {
     utils: { db, isPositiveInteger, getLimitClause, ROLES, isTherapist },
     role_id,
     patient_id,
    },
   } = res;

   const clause = (r => {
    switch (r) {
     case ROLES.PATIENT:
      return 'patient_id= ' + patient_id;
     default:
      return '1=1';
    }
   })(role_id);
   const { patient_id: id, limit } = req.query;

   const { rows } = isPositiveInteger(id)
    ? await db.query(
       'SELECT * FROM public."Patient_Deposites" WHERE 1=1 AND patient_id=$1 AND ' + clause + ' ',
       [id]
      )
    : await db.query(
       `SELECT * FROM public."Patient_Deposites" WHERE 1=1 AND ${clause} ${orderBy(
        'id'
       )} ${getLimitClause(limit)}`
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
