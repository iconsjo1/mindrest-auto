const { getLimitClause, isPositiveInteger, orderBy } = require('../../../../../Utils');

module.exports = route => (app, db) => {
 // Read Prescription Medicine[s]
 app.get(route, async (req, res) => {
  try {
   const { prescription_id: id, limit = process.env.DB_NO_LIMIT_FLAG } = req.query;

   const { rows } = isPositiveInteger(id)
    ? await db.query(
       `SELECT * FROM public."V_Prescription_Medicines" WHERE 1=1 AND prescription_id=$1 ${orderBy(
        'id'
       )} ${getLimitClause(limit)}`,
       [id]
      )
    : await db.query('SELECT * FROM public."V_Prescription_Medicines" ' + getLimitClause(limit));

   res.json({
    success: true,
    msg: `Prescription medicine${1 === rows.length ? '' : 's'} retrieved successfully.`,
    data: rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
