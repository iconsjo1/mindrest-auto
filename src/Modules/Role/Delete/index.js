module.exports = route => app => {
 // Delete Role
 app.delete(route, async (req, res) => {
  const { db, isPositiveInteger } = res.locals.utils;
  try {
   const { id } = req.query;

   if (!isPositiveInteger(id)) return res.status(404).json({ success: false, msg: 'Role was not found.' });

   const { rows } = await db.query('DELETE FROM public."Roles" WHERE 1=1 AND id = $1 RETURNING *', [id]);

   res.json({ Success: true, msg: 'Role was deleted successfully.', data: rows });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
