module.exports = route => app => {
 // Read Patients_Note[s]
 app.get(route, async (req, res) => {
  try {
   const { db, isPositiveInteger, getLimitClause } = res.locals.utils;

   const { patient_id, limit } = req.query;

   const { rows } = isPositiveInteger(patient_id)
    ? await db.query('SELECT * FROM public."V_Patients_Notes" WHERE 1=1 AND patient_id=$1', [patient_id])
    : await db.query('SELECT * FROM public."V_Patients_Notes" ' + getLimitClause(limit));

   res.json({
    success: true,
    no_of_records: rows.length,
    msg: `Patient Note${1 === rows.length ? ' was' : 's were'} retrieved successfully.`,
    data: rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
