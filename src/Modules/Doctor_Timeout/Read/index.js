module.exports = route => app => {
 // Read Doctor Timeout[s]
 app.get(route, async (req, res) => {
  try {
   const { db, isPositiveInteger, getLimitClause } = res.locals.utils;

   const { doctor_id, id, limit = -1 } = req.query;

   const { rows } = isPositiveInteger(doctor_id)
    ? await db.query('SELECT * FROM public."V_Doctor_Timeouts" WHERE 1=1 AND doctor_id=$1 ', [
       doctor_id,
      ])
    : isPositiveInteger(id)
    ? await db.query('SELECT * FROM public."V_Doctor_Timeouts" WHERE 1=1 AND id=$1 ', [id])
    : await db.query(`SELECT * FROM public."V_Doctor_Timeouts"  ${getLimitClause(limit)}`);

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
