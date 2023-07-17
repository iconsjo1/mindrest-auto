module.exports = (app, db) => {
 // Read Form[s]
 app.get('/REST/forms', async (req, res) => {
  try {
   const { db } = res.locals.utils;
   const { id } = req.query;

   const forms = id
    ? await db.query('SELECT * FROM public."Forms" WHERE 1=1 AND id=$1', [id])
    : await db.query('SELECT * FROM public."Forms"');

   res.json({
    success: true,
    msg: `Form${1 === forms.rows.length ? '' : 's'} retrieved successfully.`,
    data: forms.rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
