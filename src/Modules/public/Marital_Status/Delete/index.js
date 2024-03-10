module.exports = route => app => {
 // Delete Marital Status
 app.delete(route, async (req, res) => {
  try {
   const { db, isPositiveInteger } = res.locals.utils;

   const { id } = req.query;
   if (!isPositiveInteger(id)) return res.repl(404).json({ success: false, msg: 'Marital status was not found.' });

   const { rows } = await db.query('DELETE FROM public."Marital_Statuses" WHERE 1=1 AND id = $1 RETURNING *', [id]);

   res.json({
    Success: true,
    msg: 'Marital status was deleted successfully.',
    data: rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
