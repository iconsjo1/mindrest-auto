module.exports = route => (app, db) => {
 // Update Service Category
 app.put(route, async (req, res) => {
  try {
   const { id } = req.query;
   if (!id) return res.status(404).json({ Success: false, msg: 'Service category not found.' });
   const changed = [];

   let i = 1;
   for (let prop in req.body) changed.push(`${prop} = $${i++}`);

   const modifiedServiceCategory = await db.query(
    `UPDATE public."Service_Categories" SET ${changed} WHERE 1=1 AND id=$${i} RETURNING *`,
    [...Object.values(req.body), id]
   );
   res.json({
    success: true,
    msg: 'Service category updated successfully.',
    data: modifiedServiceCategory.rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
