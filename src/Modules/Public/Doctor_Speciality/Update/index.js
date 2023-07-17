module.exports = (app, db) => {
 // Update Doctor Speciality
 app.put('/REST/doctor_specialities', async (req, res) => {
  try {
   const { db } = res.locals.utils;

   const { id } = req.query;
   if (!id) return res.status(404).json({ Success: false, msg: 'Doctor speciality not found.' });
   const changed = [];

   let i = 1;
   for (let prop in req.body) changed.push(`${prop} = $${i++}`);

   const modifiedDoctor = await db.query(
    `UPDATE public."Doctor_Specialities" SET ${changed} WHERE 1=1 AND id=$${i} RETURNING *`,
    [...Object.values(req.body), id]
   );
   res.json({
    success: true,
    msg: 'Doctor speciality updated successfully.',
    data: modifiedDoctor.rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
