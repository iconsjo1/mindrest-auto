module.exports = route => (app, db) => {
 // Read Relationship[s]
 app.get(route, async (req, res) => {
  try {
   const { db, isPositiveInteger, getLimitClause, isSQLDate } = res.locals.utils;

   const { id, limit, from, to } = req.query;

   const Date = isSQLDate(from) && isSQLDate(to) ? `AND date >='${from}' AND  date <='${to}'` : '';
   const { rows } = isPositiveInteger(id)
    ? await db.query('SELECT * FROM public."V_Payments" WHERE 1=1 AND id=$1 ' + Date, [id])
    : await db.query('SELECT * FROM public."V_Payments" WHERE 1=1 ' + Date + getLimitClause(limit));

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
