module.exports = route => app => {
 // Read Vital Sign[s]
 app.get(route, async (req, res) => {
  try {
   const { db, isPositiveInteger } = res.locals.utils;

   const { id: patient_id } = req.query;

   const { rows } = isPositiveInteger(patient_id)
    ? await db.query('SELECT * FROM public."V_Vital_Signs" WHERE 1=1 AND patient_id=$1', [
       patient_id,
      ])
    : await db.query('SELECT * FROM public."V_Vital_Signs"');

   res.json({
    success: true,
    no_of_records: rows.length,
    msg: `Vital sign${1 === rows.length ? ' was' : 's were'} retrieved successfully.`,
    data: rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
