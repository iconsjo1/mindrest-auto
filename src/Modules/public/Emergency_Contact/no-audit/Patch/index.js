module.exports = route => app => {
 // Patch Emergency Contacts [IS_DELETED]
 app.patch(route, async (req, res) => {
  try {
   const { isPositiveInteger, db } = res.locals.utils;

   const { id } = req.query;
   if (!isPositiveInteger(id)) return res.status(404).json({ success: false, msg: 'Emergency contact was not found.' });

   const { rows } = await db.query(
    'UPDATE public."Emergency_Contacts" SET is_deleted = true WHERE 1=1 AND id = $1 RETURNING *',
    [id]
   );

   res.json({
    Success: true,
    msg: 'Emergency contact was marked deleted successfully.',
    data: rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
