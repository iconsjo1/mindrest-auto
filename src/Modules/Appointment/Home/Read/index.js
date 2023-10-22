module.exports = route => app => {
 // Read Appoinment[s]
 app.get(route, async (req, res) => {
  try {
   const {
    locals: {
     utils: { db, isPositiveInteger, getLimitClause, ROLES, orderBy },
     role_id,
     doctor_id,
     therapist_id,
    },
   } = res;

   const clause = (r => {
    switch (r) {
     case ROLES.DOCTOR:
      return 'doctor_id= ' + doctor_id;
     case ROLES.THERAPIST:
      return 'doctor_id= ' + therapist_id;
     default:
      return '1=1';
    }
   })(role_id);

   const { id, limit } = req.query;

   const { rows } = isPositiveInteger(id)
    ? await db.query('SELECT * FROM public."Appointments" WHERE 1=1 AND id=$1 AND ' + clause, [id])
    : await db.query(
       `SELECT * FROM public."Appointments" WHERE  ${clause} ${orderBy('id')} ${getLimitClause(
        limit
       )}`
      );

   res.json({
    success: true,
    no_of_records: rows.length,
    msg: `Appointment${1 === rows.length ? ' was' : 's were'} retrieved successfully.`,
    data: rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
