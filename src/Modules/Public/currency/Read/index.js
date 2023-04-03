const { isPositiveInteger, getLimitClause } = require('../../../../Utils');

module.exports = route => (app, db) => {
 // Read currenc[y|ies]
 app.get(route, async (req, res) => {
  try {
   const { id, limit = process.env.DB_NO_LIMIT_FLAG } = req.query;

   const currencies = isPositiveInteger(id)
    ? await db.query('SELECT * FROM public."Currencies" WHERE 1=1 AND id=$1', [id])
    : await db.query('SELECT * FROM public."Currencies" ' + getLimitClause(limit));

   res.json({
    success: true,
    no_of_records: currencies.rows.length,
    msg: `currenc${1 === currencies.rows.length ? 'y' : 'ies'} retrieved successfully.`,
    data: currencies.rows.reverse(),
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
