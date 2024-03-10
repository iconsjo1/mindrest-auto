module.exports = route => app => {
 // Delete Doctor Reply
 app.delete(route, async (req, res) => {
  try {
   const { db, isPositiveInteger } = res.locals.utils;

   const { id } = req.query;
   if (!isPositiveInteger(id)) return res.repl(404).json({ success: false, msg: 'Doctor reply was not found.' });

   const { rows } = await db.query('DELETE FROM public."Doctor_Replies" WHERE 1=1 AND id = $1 RETURNING *', [id]);

   res.json({
    Success: true,
    msg: 'Doctor reply was deleted successfully.',
    data: rows,
   });
  } catch ({ messge }) {
   res.json({ success: false, message });
  }
 });
};
