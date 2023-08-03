module.exports = route => app => {
 // Read Doctor Schedule Reprort
 app.get(route, async (req, res) => {
  try {
   const {
    locals: {
     utils: { db, getLimitClause, ROLES },
     role_id,
     doctor_id,
    },
   } = res;

   const clause = ROLES.DOCTOR === role_id ? 'doctor_id= ' + doctor_id : '1=1';

   const { limit } = req.query;

   const { rows } = await db.query(
    `SELECT * FROM public."V_Doctor_Schedules_Report" WHERE ${clause} ${getLimitClause(limit)}`
   );

   res.json({
    success: true,
    no_of_records: rows.length,
    msg: 'Doctor schedule report retrieved successfully.',
    data: rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
