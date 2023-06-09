module.exports = route => (app, db) => {
 // Update Patient
 app.put(route, async (req, res) => {
  try {
   const { id } = req.query;
   if (!id) return res.status(404).json({ Success: false, msg: 'Patient not found.' });
   const changed = [];

   let i = 1;
   for (let prop in req.body) changed.push(`${prop} = $${i++}`);

   const modifiedPatient = await db.query(
    `UPDATE public."Patients" SET ${changed} WHERE 1=1 AND id=$${i} RETURNING *`,
    [...Object.values(req.body), id]
   );
   res.json({
    success: true,
    msg: 'Patient updated successfully.',
    data: modifiedPatient.rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
