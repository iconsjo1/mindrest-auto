module.exports = route => app => {
 // Read Marital Status[es]
 app.get(route, async (req, res) => {
  try {
   const { db, isPositiveInteger, orderBy, getLimitClause } = res.locals.utils;
   const { id, limit = -1 } = req.query;

   const { rows } = isPositiveInteger(id)
    ? await db.query('SELECT * FROM public."Marital_Statuses" WHERE 1=1 AND id=$1', [id])
    : await db.query(
       `SELECT * FROM public."Marital_Statuses" ${orderBy('id')} ${getLimitClause(limit)}`
      );

   res.json({
    success: true,
    no_of_records: rows.length,
    msg: `Marital status${1 === rows.length ? ' was' : 'es were'} retrieved successfully.`,
    data: rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
