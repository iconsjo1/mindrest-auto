module.exports = route => app => {
 // Read Doctor Schedule[s]
 app.get(route, async (req, res) => {
  try {
   const { db, isPositiveInteger, getLimitClause } = res.locals.utils;

   const { doctor_id: id, limit = -1 } = req.query;

   const { rows } = isPositiveInteger(id)
    ? await db.query(
       `SELECT * FROM public."V_Doctor_Schedules" WHERE 1=1 AND doctor_id=$1 ${getLimitClause(
        limit
       )}`,
       [id]
      )
    : await db.query(
       `SELECT * FROM public."V_Doctor_Schedules" WHERE 1=1 ${getLimitClause(limit)}`
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
