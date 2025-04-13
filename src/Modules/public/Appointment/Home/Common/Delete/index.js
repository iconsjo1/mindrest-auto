module.exports = route => app => {
 // Delete Appointment
 app.delete(route, async (req, res) => {
  try {
   const { isPositiveInteger, db } = res.locals.utils;

   const { id } = req.query;
   if (!isPositiveInteger(id)) return res.status(404).json({ success: false, msg: 'Appointment was not found.' });

   const { rows } = await db.query('DELETE FROM public."Appointments" WHERE 1=1 AND id = $1 RETURNING *', [id]);

   res.json({ Success: true, msg: 'Appointment was deleted successfully.', data: rows });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
