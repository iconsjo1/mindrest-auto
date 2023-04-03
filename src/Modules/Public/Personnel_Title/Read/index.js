module.exports = route => (app, db) => {
 // Read Personnel Title[s]
 app.get(route, async (req, res) => {
  try {
   const { id } = req.query;

   const personnelTitles = id
    ? await db.query('SELECT * FROM public."Personnel_Titles" WHERE 1=1 AND id=$1', [id])
    : await db.query('SELECT * FROM public."Personnel_Titles"');

   res.json({
    success: true,
    msg: `Personnel title${1 === personnelTitles.rows.length ? '' : 's'} retrieved successfully.`,
    data: personnelTitles.rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
