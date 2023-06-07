module.exports = route => (app, db) => {
 // Update Vital Sign
 app.put(route, async (req, res) => {
  try {
   const { id } = req.query;
   if (!id) return res.status(404).json({ Success: false, msg: 'Vital sign not found.' });
   const changed = [];

   let i = 1;
   for (let prop in req.body) changed.push(`${prop} = $${i++}`);

   const modifiedVitalSign = await db.query(
    `UPDATE public."Vital_Signs" SET ${changed} WHERE 1=1 AND id=$${i} RETURNING id`,
    [...Object.values(req.body), id]
   );

   const { id: vital_sign_id } = modifiedVitalSign.rows[0];
   if (!vital_sign_id) {
    throw new Error("Vital Signature wasn't updated properly");
   }
   const vitalSign_BMI = await db.query('SELECT * FROM public."V_Vital_Signs" WHERE id = $1', [id]);
   res.json({
    success: true,
    msg: 'Vital sign updated successfully.',
    data: vitalSign_BMI.rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
