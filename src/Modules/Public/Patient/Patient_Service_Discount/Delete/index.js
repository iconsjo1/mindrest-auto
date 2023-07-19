module.exports = route => app => {
 // Delete Patient Service Document
 app.delete(route, async (req, res) => {
  try {
   const { db, isPositiveInteger } = res.locals.utils;

   const { patient_id: id } = req.query;
   if (!isPositiveInteger(id))
    return res.status(404).json({ success: false, msg: 'Patient service discount not found.' });

   const { rows } = await db.query(
    'DELETE FROM public."Patient_Service_Discounts" WHERE 1=1 AND patient_id = $1 RETURNING *',
    [id]
   );

   res.json({
    Success: true,
    msg: `Patient service discount${1 === rows.length ? ' was' : 's were'} deleted successfully.`,
    data: rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
