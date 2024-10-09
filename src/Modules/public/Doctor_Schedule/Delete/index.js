module.exports = route => app => {
 // Delete Doctor Schedule
 app.delete(route, async (req, res) => {
  try {
   const {
    locals: {
     utils: { db, isPositiveInteger, ROLES },
     //  role_id,
     //  doctor_id,
    },
   } = res;
   //    const clause = ROLES.DOCTOR === role_id ? 'doctor_id= ' + doctor_id : '1=1';

   const { doctor_id, week_day_id } = req.query;
   if (!isPositiveInteger(doctor_id))
    return res.status(404).json({ success: false, msg: 'Doctor schedule was not found.' });
   if (!isPositiveInteger(week_day_id)) return res.status(404).json({ success: false, msg: 'Week day was not found.' });

   const { rows } = await db.query(
    `DELETE FROM public."Doctor_Schedules" WHERE 1=1 AND doctor_id=$1 AND week_day_id=$2 RETURNING *`,
    [doctor_id, week_day_id]
   );

   res.json({ success: true, msg: 'Doctor schedule was deleted successfully.', data: rows });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
