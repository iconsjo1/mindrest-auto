module.exports = route => (app, db) => {
 // Read Cit[y|ies]
 app.get(route, async (req, res) => {
  try {
   const { db, isPositiveInteger, getLimitClause, orderBy } = res.locals.utils;

   const { country_id, limit = -1 } = req.query;

   const { rows } = isPositiveInteger(country_id)
    ? await db.query('SELECT * FROM public."Cities" WHERE 1=1 AND country_id=$1' + orderBy('id'), [
       country_id,
      ])
    : await db.query(`SELECT * FROM public."Cities" ${orderBy('id')} ${getLimitClause(limit)}`);

   res.json({
    success: true,
    no_of_records: rows.length,
    msg: `Cit${1 === rows.length ? 'y was' : 'ies were'} retrieved successfully.`,
    data: rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
