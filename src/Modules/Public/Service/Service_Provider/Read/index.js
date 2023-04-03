module.exports = route => (app, db) => {
 // Read Service provider[s]
 app.get(route, async (req, res) => {
  try {
   const { id } = req.query;

   const serviceProviders = id
    ? await db.query('SELECT * FROM public."Service_Providers" WHERE 1=1 AND id=$1', [id])
    : await db.query('SELECT * FROM public."Service_Providers"');

   res.json({
    success: true,
    msg: `Service Provider${1 === serviceProviders.rows.length ? '' : 's'} retrieved successfully.`,
    data: serviceProviders.rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
