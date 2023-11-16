module.exports = route => app => {
 // Delete Package Service[s]
 app.delete(route, async (req, res) => {
  try {
   const { db, isPositiveInteger } = res.locals.utils;

   const { package_id: id } = req.query;
   if (!isPositiveInteger(id)) return res.status(404).json({ success: false, msg: 'Package service was not found.' });

   const { rows } = await db.query('DELETE FROM public."Package_Services" WHERE 1=1 AND package_id = $1 RETURNING *', [
    id,
   ]);

   res.json({
    Success: true,
    msg: 'Package service was deleted successfully.',
    data: rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
