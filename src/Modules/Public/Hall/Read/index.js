const { isPositiveInteger, getLimitClause } = require('../../../../Utils');

module.exports = route => (app, db) => {
 // Read Hall[s]
 app.get(route, async (req, res) => {
  try {
   const { db, isPositiveInteger, getLimitClause } = res.locals.utils;

   const { id, limit } = req.query;

   const halls = isPositiveInteger(id)
    ? await db.query('SELECT * FROM public."Halls" WHERE 1=1 AND id=$1', [id])
    : await db.query('SELECT * FROM public."Halls" ' + getLimitClause(limit));

   res.json({
    success: true,
    no_of_records: halls.rows.length,
    msg: `Hall${1 === halls.rows.length ? '' : 's'} retrieved successfully.`,
    data: halls.rows.reverse(),
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
