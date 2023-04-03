module.exports = route => (app, db) => {
 // Update Personnel Title
 app.put(route, async (req, res) => {
  try {
   const { id } = req.query;
   if (!id) return res.status(404).json({ Success: false, msg: 'Personnel title not found.' });
   const modifiedData = [];

   let i = 1;
   for (let prop in req.body) modifiedData.push(`${prop} = $${i++}`);

   const modifiedPersonnelTitle = await db.query(
    `UPDATE public."Personnel_Titles" SET ${modifiedData.join(
     ','
    )} WHERE 1=1 AND id=$${i} RETURNING *`,
    [...Object.values(req.body), id]
   );
   res.json({
    success: true,
    msg: 'Personnel title updated successfully.',
    data: modifiedPersonnelTitle.rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
