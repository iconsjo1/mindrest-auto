module.exports = route => app => {
 // Read Doctor Timeout[s]
 app.get(route, async (req, res) => {
  try {
   const {
    locals: {
     utils: { db, isPositiveInteger, getLimitClause, ROLES, isTherapist },
     role_id,
     doctor_id: idd,
     therapist_id,
    },
   } = res;
   //doctor_id
   const clause = [ROLES.DOCTOR, ROLES.THERAPIST].includes(role_id)
    ? 'doctor_id=' + idd ?? 'doctor_id= ' + therapist_id
    : '1=1';
   const { doctor_id, id, limit = -1 } = req.query;

   const { rows } = isPositiveInteger(doctor_id)
    ? await db.query(
       'SELECT * FROM public."V_Doctor_Timeouts" WHERE 1=1 AND doctor_id=$1 AND ' + clause,
       [doctor_id]
      )
    : isPositiveInteger(id)
    ? await db.query('SELECT * FROM public."V_Doctor_Timeouts" WHERE 1=1 AND id=$1 AND ' + clause, [
       id,
      ])
    : await db.query(
       `SELECT * FROM public."V_Doctor_Timeouts" WHERE ${clause} ${getLimitClause(limit)}`
      );

   res.json({
    success: true,
    no_of_records: rows.length,
    msg: `Doctor timeout${1 === rows.length ? ' was' : 's were'} retrieved successfully.`,
    data: rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
