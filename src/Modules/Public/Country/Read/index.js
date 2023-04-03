module.exports = (app, db) => {
 // Read Countr[y|ies]
 app.get('/REST/countries', async (req, res) => {
  try {
   const { id } = req.query;

   const countries = id
    ? await db.query('SELECT * FROM public."Countries" WHERE 1=1 AND id=$1', [id])
    : await db.query('SELECT * FROM public."Countries"');

   res.json({
    success: true,
    no_of_records: countries.rows.length,
    msg: `Countr${1 === countries.rows.length ? 'y' : 'ies'} retrieved successfully.`,
    data: countries.rows.reverse(),
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
