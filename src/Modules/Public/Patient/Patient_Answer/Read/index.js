module.exports = route => (app, db) => {
 // Read Patient Answer[s]
 app.get(route, async (req, res) => {
  try {
   const { id } = req.query;

   const patientAnswers = id
    ? await db.query('SELECT * FROM public."V_Patient_Answers" WHERE 1=1 AND id=$1', [id])
    : await db.query('SELECT * FROM public."V_Patient_Answers"');

   res.json({
    success: true,
    msg: `Patient answer${1 === patientAnswers.rows.length ? '' : 's'} retrieved successfully.`,
    data: patientAnswers.rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
