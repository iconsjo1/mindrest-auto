const { isPositiveInteger, getLimitClause } = require('../../../../Utils');

module.exports = route => (app, db) => {
 // Read Doctor Schedule[s]
 app.get(route, async (req, res) => {
  try {
   const { doctor_id: id, limit = process.env.DB_NO_LIMIT_FLAG } = req.query;
   if (!isPositiveInteger(id)) throw new Error('Doctor Schedules were not found.');

   const { rows } = await db.query(
    `SELECT * FROM public."V_Doctor_Schedules" WHERE 1=1 AND doctor_id=$1 ${getLimitClause(limit)}`,
    [id]
   );

   res.json({
    success: true,
    no_of_records: rows.length,
    msg: `Doctor schedule${1 === rows.length ? ' was' : 's were'}  retrieved successfully.`,
    data: rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
