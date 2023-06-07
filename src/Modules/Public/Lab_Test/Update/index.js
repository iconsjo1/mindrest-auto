module.exports = (app, db) => {
 // Update Lab Test
 app.put('/REST/lab_tests', async (req, res) => {
  try {
   const { id } = req.query;
   if (!id) return res.status(404).json({ Success: false, msg: 'items not found.' });
   const changed = [];

   let i = 1;
   for (let prop in req.body) changed.push(`${prop} = $${i++}`);

   const modifiedLabTest = await db.query(
    `UPDATE public."Lab_Tests" SET ${changed} WHERE 1=1 AND id=$${i} RETURNING *`,
    [...Object.values(req.body), id]
   );
   res.json({
    success: true,
    msg: 'Lab test updated successfully.',
    data: modifiedLabTest.rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
