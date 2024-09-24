module.exports = route => app => {
 // Update Appointment
 app.put(route, async (req, res) => {
  let client = null;
  let begun = false;
  try {
   const {
    db,
    isPositiveInteger,
    SQLfeatures,
    ROLES,
    env: { EVENT },
   } = res.locals.utils;
   const { role_id, doctor_id, user_id } = res.locals;

   const { id } = req.query;
   if (!isPositiveInteger(id)) return res.status(404).json({ Success: false, msg: 'Appointment was not found.' });

   const updatingWhere = { id };
   if (ROLES.DOCTOR === role_id) updatingWhere.doctor_id = doctor_id;

   const { bill_id, patient_id, service_id, teller, is_deleted, ...restBody } = req.body;

   const dispData = {};

   const { filters: findFilters, values: findValues } = SQLfeatures.IDFilters(updatingWhere);
   const { rows: selectedAppointment } = await db.query(
    `SELECT patient_id, service_id, appointmenr_state_id FROM public."Appointments" WHERE ${findFilters}`,
    findValues
   );
   if (0 === selectedAppointment.length)
    return res.json({ success: true, msg: 'Appointment was updated successfully.', data: [] });

   const {
    sets,
    values: updateValues,
    filters: updateFilters,
   } = SQLfeatures.update({ filters: updatingWhere, ...restBody });

   client = await db.connect();
   await client.query('BEGIN').then(() => (begun = true));

   dispData.appointment = await client
    .query(`UPDATE public."Appointments" SET ${sets} WHERE ${updateFilters} RETURNING *`, updateValues)
    .then(({ rows }) => rows);

   if (0 < dispData.appointment.length && null != dispData.appointment[0].teller) {
    await client.query(`INSERT INTO story."Events"(${EVENT.COLUMNS}) SELECT ${EVENT.ENC}`, [
     dispData.appointment[0].teller,
     user_id,
     EVENT.TYPE.UPDATE,
    ]);
   }

   await client.query('COMMIT').then(() => (begun = false));
   res.json({
    success: true,
    msg: 'Appointment was updated successfully.',
    data: rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  } finally {
   if (null != client) {
    if (true === begun) {
     try {
      await client.query('ROLLBACK');
     } catch ({ message: rmessage }) {
      throw Error(rmessage);
     }
    }
    client.release();
   }
  }
 });
};
