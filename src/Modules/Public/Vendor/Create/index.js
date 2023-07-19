module.exports = route => app => {
 // Create Vendor
 app.post(route, async (req, res) => {
  try {
   const fields = Object.keys(req.body);
   const values = Object.values(req.body);
   const enc_values = [];

   for (let i = 0; i < values.length; enc_values.push(`$${++i}`));

   const newVendor = await db.query(
    `INSERT INTO public."Vendors"(${fields}) VALUES(${enc_values}) RETURNING *`,
    values
   );
   res.json({ success: true, msg: 'Vendor created successfully.', data: newVendor.rows });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
