module.exports = route => app => {
 // Update Doctor Schedule
 app.put(route, async (req, res) => {
  try {
   const {
    locals: {
     utils: { db, isPositiveInteger, ROLES },
     role_id,
     doctor_id,
     therapist_id,
    },
   } = res;

   const clause = (r => {
    switch (r) {
     case ROLES.DOCTOR:
      return 'doctor_id= ' + doctor_id;
     case ROLES.THERAPIST:
      return 'doctor_id= ' + therapist_id;
     default:
      return '1=1';
    }
   })(role_id);

   const { id } = req.query;
   if (!isPositiveInteger(id)) return res.status(404).json({ Success: false, msg: 'Doctor schedule was not found.' });

   let i = 1;
   const changed = [];
   for (let prop in req.body) changed.push(`${prop} = $${i++}`);

   const { rows } = await db.query(
    `UPDATE public."Doctor_Schedules" SET ${changed} WHERE 1=1 AND ${clause} AND id=$${i} RETURNING *`,
    [...Object.values(req.body), id]
   );
   res.json({ success: true, msg: 'Doctor schedule was updated successfully.', data: rows });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
