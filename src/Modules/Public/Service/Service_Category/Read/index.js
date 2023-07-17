module.exports = route => (app, db) => {
 // Read Service Categor[y|ies]
 app.get(route, async (req, res) => {
  try {
   const { db, isPositiveInteger, orderBy, getLimitClause } = res.locals.utils;

   const { id, limit } = req.query;

   const { rows } = isPositiveInteger(id)
    ? await db.query('SELECT * FROM public."Service_Categories" WHERE 1=1 AND id=$1', [id])
    : await db.query(
       `SELECT * FROM public."Service_Categories" ${orderBy('id')} ${getLimitClause(limit)}`
      );

   res.json({
    success: true,
    no_of_records: rows.length,
    msg: `Service Categor${1 === rows.length ? 'y was' : 'ies were'} retrieved successfully.`,
    data: rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
