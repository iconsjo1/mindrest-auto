module.exports = route => app => {
 // Delete Doctor Timeout
 app.delete(route, async (req, res) => {
  try {
   const { db, isPositiveInteger } = res.locals.utils;

   const { id } = req.query;
   if (!isPositiveInteger(id)) return res.status(404).json({ success: false, msg: 'Doctor timeout was not found.' });

   const { rows } = await db.query('DELETE FROM public."Doctor_Timeouts" WHERE 1=1 AND id = $1 RETURNING *', [id]);

   res.json({ Success: true, msg: 'Doctor timeout was deleted successfully.', data: rows });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
