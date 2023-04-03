const { isPositiveInteger, getLimitClause } = require('../../../../Utils');

module.exports = route => (app, db) => {
 // Read Relationship[s]
 app.get(route, async (req, res) => {
  try {
   const { id, limit } = req.query;

   const relationships = isPositiveInteger(id)
    ? await db.query('SELECT * FROM public."Relationships" WHERE 1=1 AND id=$1', [id])
    : await db.query('SELECT * FROM public."Relationships" ' + getLimitClause(limit));

   res.json({
    success: true,
    no_of_records: relationships.rows.length,
    msg: `Relationship${1 === relationships.rows.length ? '' : 's'} retrieved successfully.`,
    data: relationships.rows.reverse(),
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
