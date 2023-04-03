module.exports = route => (app, db) => {
 // Update Service Provider
 app.put(route, async (req, res) => {
  try {
   const { id } = req.query;
   if (!id) return res.status(404).json({ Success: false, msg: 'Service provider not found.' });
   const modifiedData = [];

   let i = 1;
   for (let prop in req.body) modifiedData.push(`${prop} = $${i++}`);

   const modifiedServiceProvider = await db.query(
    `UPDATE public."Service_Providers" SET ${modifiedData.join(
     ','
    )} WHERE 1=1 AND id=$${i} RETURNING *`,
    [...Object.values(req.body), id]
   );
   res.json({
    success: true,
    msg: 'Service provider updated successfully.',
    data: modifiedServiceProvider.rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
