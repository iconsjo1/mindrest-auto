module.exports = route => (app, db) => {
 // Read Vital Sign[s]
 app.get(route, async (req, res) => {
  try {
   const { id: patient_id } = req.query;

   const vitalSigns = patient_id
    ? await db.query('SELECT * FROM public."V_Vital_Signs" WHERE 1=1 AND patient_id=$1', [
       patient_id,
      ])
    : await db.query('SELECT * FROM public."V_Vital_Signs"');

   res.json({
    success: true,
    msg: `Vital sign${1 === vitalSigns.rows.length ? '' : 's'} retrieved successfully.`,
    data: vitalSigns.rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
