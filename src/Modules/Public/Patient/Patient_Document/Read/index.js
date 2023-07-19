module.exports = route => app => {
 // Read Patient Document[s]
 app.get(route, async (req, res) => {
  try {
   const { db, isPositiveInteger, getLimitClause } = res.locals.utils;

   const { patient_id: id, limit = -1 } = req.query;

   const { rows } = isPositiveInteger(id)
    ? await db.query('SELECT * FROM public."V_Patient_Documents" WHERE 1=1 AND patient_id=$1', [id])
    : await db.query('SELECT * FROM public."V_Patient_Documents" ' + getLimitClause(limit));

   res.json({
    success: true,
    no_of_records: rows.length,
    msg: `Patient document${1 === rows.length ? ' was' : 's were'} retrieved successfully.`,
    data: rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
