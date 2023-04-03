const { isPositiveInteger, getLimitClause, orderBy } = require('../../../../Utils');

module.exports = route => (app, db) => {
 // Read Bill Service[s]
 app.get(route, async (req, res) => {
  try {
   const { bill_id: id, limit } = req.query;

   const { rows } = isPositiveInteger(id)
    ? await db.query(
       'SELECT * FROM public."V_Bill_Services" WHERE 1=1 AND bill_id=$1 ' + orderBy('id'),
       [id]
      )
    : await db.query(
       `SELECT * FROM public."V_Bill_Services" ${orderBy('id')} ${getLimitClause(limit)}`
      );

   res.json({
    success: true,
    no_of_records: rows.length,
    msg: `Bill service${1 === rows.length ? '' : 's'} retrieved successfully.`,
    data: rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
