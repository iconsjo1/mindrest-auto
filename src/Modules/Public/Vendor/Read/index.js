module.exports = route => (app, db) => {
 // Read Vendor[s]
 app.get(route, async (req, res) => {
  try {
   const { id } = req.query;

   const vendor = id
    ? await db.query('SELECT * FROM public."Vendors" WHERE 1=1 AND id=$1', [id])
    : await db.query('SELECT * FROM public."Vendors"');

   res.json({
    success: true,
    msg: `Vendor${1 === vendor.rows.length ? '' : 's'} retrieved successfully.`,
    data: vendor.rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
