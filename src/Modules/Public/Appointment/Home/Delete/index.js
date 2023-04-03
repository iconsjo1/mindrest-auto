const { isPositiveInteger } = require('../../../../../Utils');

module.exports = route => (app, db) => {
 // Delete Appointment
 app.delete(route, async (req, res) => {
  try {
   const { id } = req.query;
   if (!isPositiveInteger(id))
    return res.status(404).json({ success: false, msg: 'Appointment not found.' });

   const deletedAppointment = await db.query(
    'DELETE FROM public."Appointments" WHERE 1=1 AND id = $1 RETURNING *',
    [id]
   );

   res.json({
    Success: true,
    msg: 'Appointment deleted successfully.',
    data: deletedAppointment.rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
