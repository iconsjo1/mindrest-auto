module.exports = route => app => {
 // Update Patient
 app.put(route, async (req, res) => {
  let client = null;
  let begun = false;
  try {
   const {
    db,
    isPositiveInteger,
    SQLfeatures,
    isValidObject,
    ROLES,
    env: { EVENT },
   } = res.locals.utils;
   const { role_id, doctor_id, user_id } = res.locals;

   const { user_id: id, patient_id } = req.query;
   const { user, patient, idsdoctors } = req.body;
   if (!isPositiveInteger(id)) return res.status(404).json({ success: false, msg: 'Patient was not found.' });

   delete req.body.user.is_deleted;
   delete req.body.user.teller;

   delete req.body.patient.is_deleted;
   delete req.body.patient.teller;

   if (
    !isValidObject(user) ||
    !isValidObject(patient) ||
    !Array.isArray(idsdoctors) ||
    idsdoctors.length == 0 ||
    !idsdoctors.every(id => isPositiveInteger(id))
   )
    throw Error('Incorrect submittion of data.');

   const {
    sets: usersSets,
    values: userValues,
    filters: userFilters,
   } = SQLfeatures.update({ filters: { id: id }, ...user });

   const {
    sets: patientSets,
    values: patientValues,
    filters: patientFilters,
   } = SQLfeatures.update({ filters: { user_id: patient_id }, ...patient });
   const display = {};

   client = await db.connect();
   await client.query('BEGIN').then(() => (begun = true));

   display.user = await client
    .query(`UPDATE public."Users" SET ${usersSets} WHERE ${userFilters} RETURNING *`, userValues)
    .then(({ rows }) => rows[0]);

   display.patient = await client
    .query(`UPDATE public."Patients" SET ${patientSets} WHERE ${patientFilters} RETURNING *`, patientValues)
    .then(({ rows }) => rows[0]);

   await client.query('DELETE FROM public."Doctor_Incharges" WHERE patient_id =$1 ', [patient_id]);

   display.doctor_incharges = await client
    .query('INSERT INTO public."Doctor_Incharges"(patient_id,doctor_id) SELECT $1, unnest($2::int[]) RETURNING * ', [
     patient_id,
     idsdoctors,
    ])
    .then(({ rows }) => rows);

   if (isValidObject(display.user) && null != display.user.teller) {
    await client.query(`INSERT INTO story."Events"(${EVENT.COLUMNS}) SELECT ${EVENT.ENC} `, [
     display.user.teller,
     user_id,
     EVENT.TYPE.UPDATE,
    ]);
   }
   if (isValidObject(display.patient) && null != display.patient.teller) {
    await client.query(`INSERT INTO story."Events"(${EVENT.COLUMNS}) SELECT ${EVENT.ENC} `, [
     display.patient.teller,
     user_id,
     EVENT.TYPE.UPDATE,
    ]);
   }

   await client.query('COMMIT').then(() => (begun = false));
   res.json({
    success: true,
    msg: 'Patient was updated successfully.',
    data: display,
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
