module.exports = (app, db) => {
 // Read Medicine[s]
 app.get('/REST/medicines', async (req, res) => {
  try {
   const { id } = req.query;

   const midicines = id
    ? await db.query('SELECT * FROM public."Medicines" WHERE 1=1 AND id=$1', [id])
    : await db.query('SELECT * FROM public."Medicines"');

   res.json({
    success: true,
    msg: `Medicine${1 === midicines.rows.length ? '' : 's'} retrieved successfully.`,
    data: midicines.rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
