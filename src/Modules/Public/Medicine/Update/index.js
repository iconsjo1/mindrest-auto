module.exports = (app, db) => {
 // Update Medicine
 app.put('/REST/medicines', async (req, res) => {
  try {
   const { id } = req.query;
   if (!id) return res.status(404).json({ Success: false, msg: 'Medicine not found.' });
   const modifiedData = [];

   let i = 1;
   for (let prop in req.body) modifiedData.push(`${prop} = $${i++}`);

   const modifiedMedicine = await db.query(
    `UPDATE public."Medicines" SET ${modifiedData.join(',')} WHERE 1=1 AND id=$${i} RETURNING *`,
    [...Object.values(req.body), id]
   );
   res.json({
    success: true,
    msg: 'Medicine updated successfully.',
    data: modifiedMedicine.rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
