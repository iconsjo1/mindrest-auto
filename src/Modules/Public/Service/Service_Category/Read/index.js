module.exports = route => (app, db) => {
 // Read Service Categor[y|ies]
 app.get(route, async (req, res) => {
  try {
   const { id } = req.query;

   const serviceCategories = id
    ? await db.query('SELECT * FROM public."Service_Categories" WHERE 1=1 AND id=$1', [id])
    : await db.query('SELECT * FROM public."Service_Categories"');

   res.json({
    success: true,
    msg: `Service Categor${
     1 === serviceCategories.rows.length ? 'y' : 'ies'
    } retrieved successfully.`,
    data: serviceCategories.rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
