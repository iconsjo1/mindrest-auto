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
    env: {
     EVENT,
     BILLEDAPPOINTMENTS: { COMPLETED, CONFIRMED },
     INVOICE,
    },
   } = res.locals.utils;
   const { role_id, doctor_id, user_id } = res.locals;

   const { id } = req.query;
   if (!isPositiveInteger(id)) return res.status(404).json({ Success: false, msg: 'Appointment was not found.' });

   const updatingWhere = { id };
   if (ROLES.DOCTOR === role_id) updatingWhere.doctor_id = doctor_id;

   const { patient_id, service_id, teller, is_deleted, ...restBody } = req.body;

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
    const billables = [COMPLETED, CONFIRMED];

    if (
     billables.includes(parseInt(restBody.appointment_state_id, 10)) &&
     !billables.includes(selectedAppointment[0].appointment_state_id)
    ) {
     const { rows: serviceDiscounts } = await client.query(
      `WITH s AS (
          SELECT id, service_ref, service_charge
          FROM "Services"
       )
       SELECT 
          service_ref,
          service_charge,
          service_charge 
          - CASE is_percentage
             WHEN true THEN service_charge * (1 - discount / 100::numeric)
             WHEN false THEN discount
             ELSE 0 
            END AS discount
       FROM "Appointments" a
       JOIN s ON a.service_id = s.id
       LEFT JOIN "Patient_Service_Discounts" psd USING(patient_id, service_id)
       WHERE a.id = $1`,
      [id]
     );
     if (0 === serviceDiscounts.length) throw Error('Error retriving discount data');

     const [{ service_ref, service_charge, discount }] = serviceDiscounts;

     dispData.invoice = await INVOICE.create(service_ref, discount ?? service_charge);
    }
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
