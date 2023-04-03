module.exports = (app, db) => {
 // Read Lab[s]
 app.get('/REST/labs', async (req, res) => {
  try {
   const { id } = req.query;

   const labs = id
    ? await db.query('SELECT * FROM public."Labs" WHERE 1=1 AND id=$1', [id])
    : await db.query('SELECT * FROM public."Labs"');

   res.json({
    success: true,
    msg: `lab${1 === labs.rows.length ? '' : 's'} retrieved successfully.`,
    data: labs.rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
