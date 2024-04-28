module.exports = route => app => {
 // Update Patient
 app.put(route, async (req, res) => {
  try {
   const { db, isPositiveInteger, ROLES } = res.locals.utils;
   const { role_id, doctor_id } = res.locals;

   const clause = ROLES.DOCTOR == role_id ? 'doctor_id=' + doctor_id : '1=1';

   delete req.body.is_deleted; // Manual operation is prohibited.
   delete req.body.teller; // Manual operation is prohibited.

   const { id } = req.query;
   if (!isPositiveInteger(id)) return res.status(404).json({ Success: false, msg: 'Patient was not found.' });

   const changed = [];
   let i = 1;
   for (let prop in req.body) changed.push(`${prop} = $${i++}`);

   const { rows } = await db.query(
    `UPDATE public."Patients" SET ${changed} WHERE 1=1 AND id=$${i} AND ${clause} RETURNING *`,
    [...Object.values(req.body), id]
   );
   res.json({
    success: true,
    msg: 'Patient was updated successfully.',
    data: rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
