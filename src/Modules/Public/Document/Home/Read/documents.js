module.exports = route => (app, db) => {
 // Read Documents
 app.get(route, async (req, res) => {
  try {
   const { db } = res.locals.utils;

   const documents = await db.query('SELECT * FROM public."Documents"');

   res.json({
    success: true,
    msg: `Documents${1 === documents.rows.length ? '' : 's'} retrieved successfully.`,
    data: documents.rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
