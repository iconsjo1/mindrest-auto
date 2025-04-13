module.exports = route => app => {
 // Delete Prescription Medicine[s]
 app.delete(route, async (req, res) => {
  try {
   const { db, isPositiveInteger } = res.locals.utils;

   const { prescription_id: id } = req.query;
   if (!isPositiveInteger(id))
    return res.status(404).json({ success: false, msg: 'Prescription medicine was not found.' });

   const { rows } = await db.query(
    'DELETE FROM public."Prescription_Medicines" WHERE 1=1 AND prescription_id = $1 RETURNING *',
    [id]
   );

   res.json({ Success: true, msg: 'Prescription medicine was deleted successfully.', data: rows });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
