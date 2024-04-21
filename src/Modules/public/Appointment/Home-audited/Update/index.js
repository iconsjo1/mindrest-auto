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

   const updateFilters = { id };

   if (ROLES.DOCTOR === role_id) updateFilters.doctor_id = doctor_id;

   delete req.body.is_deleted; // Manual operation is prohibited.

   const { sets, values, filters } = SQLfeatures.update({ filters: updateFilters, ...req.body });

   client = await db.connect();
   await client.query('BEGIN').then(() => (begun = true));

   const { rows } = await client.query(`UPDATE public."Appointments" SET ${sets} WHERE ${filters} RETURNING *`, values);
   if (0 < rows.length && null != rows[0].teller_id)
    await client.query(`INSERT INTO story."Events"(${EVENT.COLUMNS}) SELECT ${EVENT.ENC}`, [
     rows[0].teller_id,
     user_id,
     EVENT.TYPE.UPDATE,
    ]);

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
