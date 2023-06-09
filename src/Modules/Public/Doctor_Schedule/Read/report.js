const { getLimitClause } = require('../../../../Utils');

module.exports = route => (app, db) => {
 // Read Doctor Schedule Reprort
 app.get(route, async (req, res) => {
  try {
   const { limit } = req.query;

   const { rows } = await db.query(
    `SELECT * FROM public."V_Doctor_Schedules_Report" ${getLimitClause(limit)}`
   );

   res.json({
    success: true,
    no_of_records: rows.length,
    msg: 'Doctor schedule report retrieved successfully.',
    data: rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
