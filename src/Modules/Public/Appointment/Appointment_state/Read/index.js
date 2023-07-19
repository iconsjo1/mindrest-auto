module.exports = route => app => {
 // Read Appointment State[s]
 app.get(route, async (req, res) => {
  try {
   const { db, isPositiveInteger, getLimitClause, orderBy } = res.locals.utils;

   const { id, limit = -1 } = req.query;

   const { rows } = isPositiveInteger(id)
    ? await db.query('SELECT * FROM public."Appointment_States" WHERE 1=1 AND id=$1', [id])
    : await db.query(
       `SELECT * FROM public."Appointment_States" ${orderBy('id')} ${getLimitClause(limit)}`
      );

   res.json({
    success: true,
    no_of_records: rows.length,
    msg: `Appointment state${1 === rows.length ? ' was' : 's were'} retrieved successfully.`,
    data: rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
