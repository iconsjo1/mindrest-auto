module.exports = route => app => {
 // Update Doctor Schedule
 app.put(route, async (req, res) => {
  let client = null;
  let begun = false;
  try {
   const {
    locals: {
     utils: { db, isPositiveInteger, ROLES, SQLfeatures },
     //  role_id,
     //  doctor_id: rdoctor_id,
     //  therapist_id,
    },
   } = res;

   //  const clause = (r => {
   //   switch (r) {
   //    case ROLES.DOCTOR:
   //     return 'doctor_id= ' + rdoctor_id;
   //    case ROLES.THERAPIST:
   //     return 'doctor_id= ' + therapist_id;
   //    default:
   //     return '1=1';
   //   }
   //  })(role_id);

   const { id: doctor_id } = req.query;
   const { week_day_id, time_table } = req.body;

   if (!isPositiveInteger(doctor_id))
    return res.status(404).json({ success: false, msg: 'Doctor schedule was not found.' });
   if (!isPositiveInteger(week_day_id)) return res.status(404).json({ success: false, msg: 'Week day was not found.' });

   const { fields, rows, values } = SQLfeatures.bulkInsert(time_table, { doctor_id, week_day_id });

   client = await db.connect();
   await client.query('BEGIN').then(() => (begun = true));

   await client.query(`DELETE FROM public."Doctor_Schedules" WHERE doctor_id =$1 AND week_day_id=$2 `, [
    doctor_id,
    week_day_id,
   ]);

   const data = await client
    .query(`INSERT INTO public."Doctor_Schedules"(${fields}) VALUES${rows} RETURNING *`, values)
    .then(({ rows }) => rows);

   await client.query('COMMIT').then(() => (begun = false));

   res.json({ success: true, msg: 'Doctor schedule was updated successfully.', data });
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
