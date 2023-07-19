module.exports = route => (app, db) => {
 // Delete Bill Service
 app.delete(route, async (req, res) => {
  try {
   const { db, isPositiveInteger } = res.locals.utils;

   const { bill_id: id } = req.query;
   if (!isPositiveInteger(id))
    return res.status(404).json({ success: false, msg: 'Bill service not found.' });

   const { rows } = await db.query(
    'DELETE FROM public."Bill_Services" WHERE 1=1 AND bill_id = $1 RETURNING *',
    [id]
   );

   res.json({
    Success: true,
    msg: `Bill service${1 === rows.length ? ' was' : 's were'} deleted successfully.`,
    data: rows.sort((a, b) => Number(b.id) - Number(a.id)),
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
