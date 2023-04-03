module.exports = route => (app, db) => {
 // Update Doctor Holiday
 app.put(route, async (req, res) => {
  try {
   const { id } = req.query;
   if (!id) return res.status(404).json({ Success: false, msg: 'Doctor holiday not found.' });

   const modifiedData = [];

   let i = 1;
   for (let prop in req.body) modifiedData.push(`${prop} = $${i++}`);

   const modifiedDoctorHoliday = await db.query(
    `UPDATE public."Doctor_Holidays" SET ${modifiedData.join(
     ','
    )} WHERE 1=1 AND id=$${i} RETURNING *`,
    [...Object.values(req.body), id]
   );

   res.json({
    success: true,
    msg: 'Doctor holiday updated successfully.',
    data: modifiedDoctorHoliday.rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
