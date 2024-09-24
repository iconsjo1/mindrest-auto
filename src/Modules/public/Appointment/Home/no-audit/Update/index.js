module.exports = route => app => {
 // Update Appointment
 app.put(route, async (req, res) => {
  try {
   const { db, isPositiveInteger, SQLfeatures, ROLES } = res.locals.utils;
   const { role_id, doctor_id } = res.locals;

   const { id } = req.query;
   if (!isPositiveInteger(id)) return res.status(404).json({ Success: false, msg: 'Appointment was not found.' });

   const updateWhere = { id };

   if (ROLES.DOCTOR === role_id) updateWhere.doctor_id = doctor_id;

   const { bill_id, patient_id, service_id, teller, is_deleted, ...restBody } = req.body;

   const { sets, values, filters } = SQLfeatures.update({ filters: updateWhere, ...restBody });

   const { rows } = await db.query(`UPDATE public."Appointments" SET ${sets} WHERE ${filters} RETURNING *`, values);

   res.json({
    success: true,
    msg: 'Appointment was updated successfully.',
    data: rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
