module.exports = (app, db) => {
 // Update Lab
 app.put('/REST/labs', async (req, res) => {
  try {
   const { id } = req.query;
   if (!id) return res.status(404).json({ Success: false, msg: 'lab not found.' });
   const changed = [];

   let i = 1;
   for (let prop in req.body) changed.push(`${prop} = $${i++}`);

   const modifiedLabs = await db.query(
    `UPDATE public."Labs" SET ${changed} WHERE 1=1 AND id=$${i} RETURNING *`,
    [...Object.values(req.body), id]
   );
   res.json({
    success: true,
    msg: 'Lab updated successfully.',
    data: modifiedLabs.rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
