module.exports = route => app => {
 // Read Session[s]
 app.get(route, async (req, res) => {
  try {
   const { db, isPositiveInteger, orderBy, getLimitClause } = res.locals.utils;

   const { id, limit } = req.query;

   const { rows } = isPositiveInteger(id)
    ? await db.query('SELECT * FROM public."Sessions" WHERE 1=1 AND id=$1', [id])
    : await db.query(`SELECT * FROM public."Sessions" ${orderBy('id')} ${getLimitClause(limit)}`);

   res.json({
    success: true,
    no_of_records: rows.length,
    msg: `Session${1 === rows.length ? ' was' : 's were'} retrieved successfully.`,
    data: rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
