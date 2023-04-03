module.exports = route => (app, db) => {
 // Read Service[s]
 app.get(route, async (req, res) => {
  try {
   const { id } = req.query;

   const services = id
    ? await db.query('SELECT * FROM public."V_Services" WHERE 1=1 AND id=$1', [id])
    : await db.query('SELECT * FROM public."V_Services"');

   res.json({
    success: true,
    msg: `Service${1 === services.rows.length ? '' : 's'} retrieved successfully.`,
    data: services.rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
