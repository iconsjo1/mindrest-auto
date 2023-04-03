module.exports = route => (app, db) => {
 // Read Patient Document[s]
 app.get(route, async (req, res) => {
  try {
   const { patient_id: id } = req.query;

   const patientDocuments = id
    ? await db.query('SELECT * FROM public."V_Patient_Documents" WHERE 1=1 AND patient_id=$1', [id])
    : await db.query('SELECT * FROM public."V_Patient_Documents"');

   res.json({
    success: true,
    msg: `Patient document${1 === patientDocuments.rows.length ? '' : 's'} retrieved successfully.`,
    data: patientDocuments.rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
