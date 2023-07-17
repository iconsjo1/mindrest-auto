module.exports = route => (app, db) => {
 // Read Prescription Medicine[s]
 app.get(route, async (req, res) => {
  try {
   const { db, isPositiveInteger, getLimitClause } = res.locals.utils;

   const { prescription_id: id, limit = -1 } = req.query;

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
    no_of_records: rows.length,
    msg: `Prescription medicine${1 === rows.length ? ' was' : 's were'} retrieved successfully.`,
    data: rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
