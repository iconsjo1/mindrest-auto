module.exports = route => (app, db) => {
 // Read Document Categor[ies]
 app.get(route, async (req, res) => {
  try {
   const { id } = req.query;

   const documentCategories = id
    ? await db.query('SELECT * FROM public."Document_Categories" WHERE 1=1 AND id=$1', [id])
    : await db.query('SELECT * FROM public."Document_Categories"');

   res.json({
    success: true,
    msg: `Document categor${
     1 === documentCategories.rows.length ? 'y' : 'ies'
    } retrieved successfully.`,
    data: documentCategories.rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
