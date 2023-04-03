const { isPositiveInteger, getLimitClause, orderBy } = require('../../../../Utils');
module.exports = route => (app, db) => {
 // Read Cit[y|ies]
 app.get(route, async (req, res) => {
  try {
   const { country_id, limit } = req.query;

   const cities = isPositiveInteger(country_id)
    ? await db.query('SELECT * FROM public."Cities" WHERE 1=1 AND country_id=$1' + orderBy('id'), [
       country_id,
      ])
    : await db.query(`SELECT * FROM public."Cities" ${orderBy('id')} ${getLimitClause(limit)}`);

   res.json({
    success: true,
    no_of_records: cities.rows.length,
    msg: `Cit${1 === cities.rows.length ? 'y' : 'ies'} retrieved successfully.`,
    data: cities.rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
