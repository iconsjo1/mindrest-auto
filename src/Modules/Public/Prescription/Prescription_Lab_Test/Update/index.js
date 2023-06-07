module.exports = route => (app, db) => {
 // Update Doctor Schedule
 app.put(route, async (req, res) => {
  try {
   const { id } = req.query;
   const { db, isPositiveInteger } = res.locals.utils;

   if (!isPositiveInteger(id))
    return res.status(404).json({ Success: false, msg: 'Prescription lab test not found.' });

   let i = 1;
   const changed = [];

   for (let prop in req.body) changed.push(`${prop} = $${i++}`);

   const { rows } = await db.query(
    `UPDATE public."Prescription_Tests" SET ${changed} WHERE 1=1 AND id=$${i} RETURNING *`,
    [...Object.values(req.body), id]
   );
   res.json({
    success: true,
    msg: 'Prescription lab test updated successfully.',
    data: rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
