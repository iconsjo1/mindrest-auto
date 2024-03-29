module.exports = route => app => {
 // Delete Deposite Method
 app.delete(route, async (req, res) => {
  try {
   const { db, isPositiveInteger } = res.locals.utils;

   const { id } = req.query;
   if (!isPositiveInteger(id)) return res.status(404).json({ success: false, msg: 'Deposite method was not found.' });

   const { rows } = await db.query('DELETE FROM public."Deposite_Methods" WHERE 1=1 AND id = $1 RETURNING *', [id]);

   res.json({
    Success: true,
    msg: 'Deposite method was deleted successfully.',
    data: rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
