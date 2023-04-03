const { isPositiveInteger, getLimitClause, orderBy } = require('../../../../../Utils');

module.exports = route => (app, db) => {
 // Read Appoinment[s]
 app.get(route, async (req, res) => {
  try {
   const { id, limit } = req.query;

   const appointments = isPositiveInteger(id)
    ? await db.query('SELECT * FROM public."Appointments" WHERE 1=1 AND id=$1', [id])
    : await db.query(
       `SELECT * FROM public."Appointments" ${orderBy('id')} ${getLimitClause(limit)}`
      );

   res.json({
    success: true,
    no_of_records: appointments.rows.length,
    msg: `Appointment${1 === appointments.rows.length ? '' : 's'} retrieved successfully.`,
    data: appointments.rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
