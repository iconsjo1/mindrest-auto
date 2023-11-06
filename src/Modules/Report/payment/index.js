module.exports = route => app => {
 // Read Relationship[s]
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

   const { id, limit, from, to } = req.query;

   const Date = isSQLDate(from) && isSQLDate(to) ? `AND date >='${from}' AND  date <='${to}'` : '';
   const { rows } = isPositiveInteger(id)
    ? await db.query('SELECT * FROM public."V_Payments" WHERE 1=1 AND id=$1  AND ' + clause + ' ' + Date, [id])
    : await db.query('SELECT * FROM public."V_Payments" WHERE 1=1 AND ' + clause + ' ' + Date + getLimitClause(limit));

   res.json({
    success: true,
    no_of_records: rows.length,
    msg: `Payment${1 === rows.length ? ' was' : 's were'} retrieved successfully.`,
    data: rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
