module.exports = route => (app, db) => {
 // Read Patient[s]
 app.get(route, async (req, res) => {
  try {
   const { id } = req.query;

   const patients = id
    ? await db.query('SELECT * FROM public."Patients" WHERE 1=1 AND id=$1', [id])
    : await db.query('SELECT * FROM public."Patients"');

   res.json({
    success: true,
    msg: `Patient${1 === patients.rows.length ? '' : 's'} retrieved successfully.`,
    data: patients.rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
