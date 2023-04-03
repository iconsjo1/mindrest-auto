const { isPositiveInteger, getLimitClause, orderBy } = require('../../../../../Utils');

module.exports = route => (app, db) => {
 // Read Prescription Text Type[s]
 app.get(route, async (req, res) => {
  try {
   const { id, limit = process.env.DB_NO_LIMIT_FLAG } = req.query;

   const { rows } = isPositiveInteger(id)
    ? await db.query('SELECT * FROM public."Prescription_Text_Types" WHERE 1=1 AND id=$1', [id])
    : await db.query(
       `SELECT * FROM public."Prescription_Text_Types" ${orderBy('id')} ${getLimitClause(limit)}`
      );

   res.json({
    success: true,
    msg: `Prescription text type${1 === rows.length ? '' : 's'} retrieved successfully.`,
    data: rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
