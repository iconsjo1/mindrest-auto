const { isPositiveInteger, getLimitClause } = require('../../../../../Utils');

module.exports = route => (app, db) => {
 // Read Patient Deposite[s]
 app.get(route, async (req, res) => {
  try {
   const { patient_id: id, limit } = req.query;

   const patientDeposites = isPositiveInteger(id)
    ? await db.query('SELECT * FROM public."Patient_Deposites" WHERE 1=1 AND patient_id=$1', [id])
    : await db.query('SELECT * FROM public."Patient_Deposites" ' + getLimitClause(limit));

   res.json({
    success: true,
    no_of_records: patientDeposites.rows.length,
    msg: `Patient deposite${1 === patientDeposites.rows.length ? '' : 's'} retrieved successfully.`,
    data: patientDeposites.rows.reverse(),
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
