module.exports = route => app => {
 // Delete Patient Answer
 app.delete(route, async (req, res) => {
  try {
   const { db, isPositiveInteger } = res.locals.utils;

   const { id } = req.query;
   if (!isPositiveInteger(id)) return res.status(404).json({ success: false, msg: 'Patient answer was not found.' });

   const { rows } = await db.query('DELETE FROM public."Patient_Answers" WHERE 1=1 AND id = $1 RETURNING *', [id]);

   res.json({
    Success: true,
    msg: 'Patient answer was deleted successfully.',
    data: rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
