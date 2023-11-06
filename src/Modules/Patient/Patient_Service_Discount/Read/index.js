module.exports = route => app => {
 // Read Patient Service Document[s]
 app.get(route, async (req, res) => {
  try {
   const {
    locals: {
     utils: { db, isPositiveInteger, isSQLDate, getLimitClause, ROLES },
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
    ? await db.query('SELECT * FROM public."V_Patient_Service_Discounts" WHERE 1=1 AND patient_id=$1 AND ' + clause, [
       id,
      ])
    : await db.query(
       'SELECT * FROM public."V_Patient_Service_Discounts" WHERE 1=1 AND ' + clause + ' ' + getLimitClause(limit)
      );

   res.json({
    success: true,
    no_of_records: rows.length,
    msg: `Patient service discount${1 === rows.length ? ' was' : 's were'} retrieved successfully.`,
    data: rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
