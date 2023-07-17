module.exports = (app, db) => {
 // Read Form detail[s]
 app.get('/REST/form_details', async (req, res) => {
  try {
   const { db } = res.locals.utils;
   const { id } = req.query;

   const formDetails = id
    ? await db.query('SELECT form_details FROM public."Forms" WHERE 1=1 AND id=$1', [id])
    : await db.query('SELECT form_details FROM public."Forms"');

   res.json({
    success: true,
    msg: `Form detail${1 === formDetails.rows.length ? '' : 's'} retrieved successfully.`,
    data: formDetails.rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
