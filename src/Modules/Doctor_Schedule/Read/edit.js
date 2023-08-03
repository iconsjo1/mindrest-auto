module.exports = route => app => {
 // Read Doctor Schedule[s]
 app.get(route, async (req, res) => {
  try {
   const {
    locals: {
     utils: { db, isPositiveInteger, getLimitClause, ROLES },
     role_id,
     doctor_id,
    },
   } = res;

   const clause = ROLES.DOCTOR === role_id ? 'doctor_id= ' + doctor_id : '1=1';

   const { doctor_id: id, limit = -1 } = req.query;

   const { rows } = isPositiveInteger(id)
    ? await db.query(
       `SELECT * FROM public."V_Doctor_Schedules" WHERE 1=1 AND doctor_id=$1 AND ${clause} ${getLimitClause(
        limit
       )}`,
       [id]
      )
    : await db.query(
       `SELECT * FROM public."V_Doctor_Schedules" WHERE 1=1 AND ${clause} ${getLimitClause(limit)}`
      );

   res.json({
    success: true,
    no_of_records: rows.length,
    msg: `Doctor schedule${1 === rows.length ? ' was' : 's were'}  retrieved successfully.`,
    data: rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
