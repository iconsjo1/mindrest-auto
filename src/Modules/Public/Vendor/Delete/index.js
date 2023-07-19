module.exports = route => app => {
 // Delete Vendor
 app.delete(route, async (req, res) => {
  try {
   const { id } = req.query;
   if (!id) return res.status(404).json({ success: false, msg: 'Vendor not found.' });

   const deletedVendor = await db.query(
    'DELETE FROM public."Vendors" WHERE 1=1 AND id = $1 RETURNING *',
    [id]
   );

   res.json({ Success: true, msg: 'Vendor deleted successfully.', data: deletedVendor.rows });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
