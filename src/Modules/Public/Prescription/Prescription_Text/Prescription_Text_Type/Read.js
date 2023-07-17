module.exports = route => (app, db) => {
 // Read Prescription Text Type[s]
 app.get(route, async (req, res) => {
  try {
   const { db, isPositiveInteger, orderBy, getLimitClause } = res.locals.utils;

   const { id, limit = -1 } = req.query;

   const { rows } = isPositiveInteger(id)
    ? await db.query('SELECT * FROM public."Prescription_Text_Types" WHERE 1=1 AND id=$1', [id])
    : await db.query(
       `SELECT * FROM public."Prescription_Text_Types" ${orderBy('id')} ${getLimitClause(limit)}`
      );

   res.json({
    success: true,
    no_of_records: rows.length,
    msg: `Prescription text type${1 === rows.length ? ' was' : 's were'} retrieved successfully.`,
    data: rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
