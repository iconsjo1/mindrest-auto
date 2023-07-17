module.exports = route => (app, db) => {
 // Read Prescription Lab Test[s]
 app.get(route, async (req, res) => {
  try {
   const { db, isPositiveInteger, getLimitClause, orderBy } = res.locals.utils;
   const { id, limit } = req.query;

   const { rows } = isPositiveInteger(id)
    ? await db.query('SELECT * FROM public."Prescription_Tests" WHERE 1=1 AND id=$1', [id])
    : await db.query(
       `SELECT * FROM public."Prescription_Tests" ${orderBy('id')} ${getLimitClause(limit)}`
      );

   res.json({
    success: true,
    no_of_records: rows.length,
    msg: `Prescription lab test${1 === rows.length ? ' was' : 's were'} retrieved successfully.`,
    data: rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
