module.exports = route => app => {
 // Update Appointment
 app.put(route, async (req, res) => {
  try {
   const { db, isPositiveInteger, SQLfeatures, ROLES } = res.locals.utils;
   const { role_id, doctor_id } = res.locals;

   const { id } = req.query;
   if (!isPositiveInteger(id)) return res.status(404).json({ Success: false, msg: 'Appointment was not found.' });

   const updateFilters = { id };

   if (ROLES.DOCTOR === role_id) updateFilters.doctor_id = doctor_id;

   delete req.body.is_deleted; // Manual operation is prohibited.

   const { sets, values, filters } = SQLfeatures.update({ filters: updateFilters, ...req.body });

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
