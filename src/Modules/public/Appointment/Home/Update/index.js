module.exports = route => app => {
 // Update Appointment
 app.put(route, async (req, res) => {
  try {
   const {
    locals: {
     utils: { db, isPositiveInteger, ROLES },
     role_id,
     doctor_id,
    },
   } = res;
   const clause = ROLES.DOCTOR === role_id ? 'doctor_id=' + doctor_id : '1=1';

   const { id } = req.query;
   if (!isPositiveInteger(id)) return res.status(404).json({ Success: false, msg: 'Appointment not found.' });

   let i = 1;
   const changed = [];
   for (let prop in req.body) changed.push(`${prop} = $${i++}`);

   const { rows } = await db.query(
    `UPDATE public."Appointments" SET ${changed} WHERE 1=1 AND id=$${i} AND ${clause} RETURNING *`,
    [...Object.values(req.body), id]
   );
   res.json({
    success: true,
    msg: 'Appointment updated successfully.',
    data: rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
