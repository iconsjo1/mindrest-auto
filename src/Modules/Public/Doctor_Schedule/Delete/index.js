module.exports = route => app => {
 // Delete Doctor Schedule
 app.delete(route, async (req, res) => {
  try {
   const { db, isPositiveInteger } = res.locals.utils;

   const { id } = req.query;
   if (!isPositiveInteger(id))
    return res.status(404).json({ success: false, msg: 'Doctor schedule not found.' });

   const { rows } = await db.query(
    'DELETE FROM public."Doctor_Schedules" WHERE 1=1 AND id = $1 RETURNING *',
    [id]
   );

   res.json({ Success: true, msg: 'Doctor schedule deleted successfully.', data: rows });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
