module.exports = route => (app, db) => {
 // Update Vendor
 app.put(route, async (req, res) => {
  try {
   const { id } = req.query;
   if (!id) return res.status(404).json({ Success: false, msg: 'Vendor not found.' });
   const modifiedData = [];

   let i = 1;
   for (let prop in req.body) modifiedData.push(`${prop} = $${i++}`);

   const modifiedVendor = await db.query(
    `UPDATE public."Vendors" SET ${modifiedData.join(',')} WHERE 1=1 AND id=$${i} RETURNING *`,
    [...Object.values(req.body), id]
   );
   res.json({
    success: true,
    msg: 'Vendor updated successfully.',
    data: modifiedVendor.rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
