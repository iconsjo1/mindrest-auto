module.exports = route => app => {
 // Read Countr[y|ies]
 app.get(route, async (req, res) => {
  try {
   const { db, isPositiveInteger, orderBy, getLimitClause } = res.locals.utils;

   const { id, limit } = req.query;

   const { rows } = isPositiveInteger(id)
    ? await db.query('SELECT * FROM public."Countries" WHERE 1=1 AND id=$1', [id])
    : await db.query(`SELECT * FROM public."Countries" ${orderBy('id')} ${getLimitClause(limit)}`);

   res.json({
    success: true,
    no_of_records: rows.length,
    msg: `Countr${1 === rows.length ? 'y' : 'ies'} retrieved successfully.`,
    data: rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
