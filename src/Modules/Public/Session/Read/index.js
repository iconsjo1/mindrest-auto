const { isPositiveInteger, getLimitClause } = require('../../../../Utils');

module.exports = route => (app, db) => {
 // Read Session[s]
 app.get(route, async (req, res) => {
  try {
   const { id, limit } = req.query;

   const Sessions = isPositiveInteger(id)
    ? await db.query('SELECT * FROM public."Sessions" WHERE 1=1 AND id=$1', [id])
    : await db.query('SELECT * FROM public."Sessions" ' + getLimitClause(limit));

   res.json({
    success: true,
    no_of_records: Sessions.rows.length,
    msg: `Session${1 === Sessions.rows.length ? '' : 's'} retrieved successfully.`,
    data: Sessions.rows.reverse(),
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
