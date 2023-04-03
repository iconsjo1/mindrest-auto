module.exports = route => (app, db) => {
 // Read Doctor repl[y|ies]
 app.get(route, async (req, res) => {
  try {
   const { db, isPositiveInteger, orderBy, getLimitClause } = res.locals.utils;
   const { id, limit = process.env.DB_NO_LIMIT_FLAG } = req.query;

   const { rows } = isPositiveInteger(id)
    ? await db.query('SELECT * FROM public."Doctor_Replies" WHERE 1=1 AND id=$1', [id])
    : await db.query(
       `SELECT * FROM public."Doctor_Replies" ${orderBy('id')} ${getLimitClause(limit)}`
      );

   res.json({
    success: true,
    no_of_records: rows.length,
    msg: `Doctor repl${1 === rows.length ? 'y' : 'ies'} retrieved successfully.`,
    data: rows,
   });
  } catch ({ messge }) {
   res.json({ success: false, message });
  }
 });
};
