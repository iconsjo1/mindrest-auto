module.exports = (app, db) => {
 // Read Lab Test[s]
 app.get('/REST/lab_tests', async (req, res) => {
  try {
   const { id } = req.query;

   const labTests = id
    ? await db.query('SELECT * FROM public."Lab_Tests" WHERE 1=1 AND id=$1', [id])
    : await db.query('SELECT * FROM public."Lab_Tests"');

   res.json({
    success: true,
    msg: `Lab test${1 === labTests.rows.length ? '' : 's'} retrieved successfully.`,
    data: labTests.rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
