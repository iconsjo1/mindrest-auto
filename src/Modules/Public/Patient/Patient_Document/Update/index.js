module.exports = route => (app, db) => {
 // Update Patient Document
 app.put(route, async (req, res) => {
  try {
   const { id } = req.query;
   if (!id) return res.status(404).json({ Success: false, msg: 'Patient document not found.' });
   const changed = [];

   let i = 1;
   for (let prop in req.body) changed.push(`${prop} = $${i++}`);

   const modifiedPatientDocument = await db.query(
    `UPDATE public."Patient_Documents" SET ${changed} WHERE 1=1 AND id=$${i} RETURNING *`,
    [...Object.values(req.body), id]
   );
   res.json({
    success: true,
    msg: 'Patient document updated successfully.',
    data: modifiedPatientDocument.rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
