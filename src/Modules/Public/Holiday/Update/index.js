module.exports = route => (app, db) => {
 // Update Holiday
 app.put(route, async (req, res) => {
  try {
   const { id } = req.query;
   if (!id) return res.status(404).json({ Success: false, msg: 'Holiday not found.' });

   const changed = [];

   let i = 1;
   for (let prop in req.body) changed.push(`${prop} = $${i++}`);

   const modifiedHoliday = await db.query(
    `UPDATE public."Holidays" SET ${changed} WHERE 1=1 AND id=$${i} RETURNING *`,
    [...Object.values(req.body), id]
   );
   res.json({
    success: true,
    msg: 'Holiday updated successfully.',
    data: modifiedHoliday.rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
