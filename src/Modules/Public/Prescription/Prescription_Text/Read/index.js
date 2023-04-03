const { isPositiveInteger, getLimitClause, orderBy } = require('../../../../../Utils');

module.exports = route => (app, db) => {
 // Read Prescription Text[s]
 app.get(route, async (req, res) => {
  try {
   const { prescription_id: id, limit } = req.query;

   const { rows } = isPositiveInteger(id)
    ? await db.query('SELECT * FROM public."Prescription_Texts" WHERE 1=1 AND prescription_id=$1', [
       id,
      ])
    : await db.query(
       `SELECT * FROM public."Prescription_Texts" ${orderBy(id)} ${getLimitClause(limit)}`
      );

   res.json({
    success: true,
    no_of_records: rows.length,
    msg: `Prescription text${1 === rows.length ? '' : 's'} retrieved successfully.`,
    data: rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
