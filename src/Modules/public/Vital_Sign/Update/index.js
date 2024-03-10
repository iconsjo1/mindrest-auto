module.exports = route => app => {
 // Update Vital Sign
 app.put(route, async (req, res) => {
  try {
   const { db, isPositiveInteger } = res.locals.utils;

   const { id } = req.query;
   if (!isPositiveInteger(id)) return res.status(404).json({ Success: false, msg: 'Vital sign was not found.' });

   const changed = [];
   let i = 1;
   for (let prop in req.body) changed.push(`${prop} = $${i++}`);

   const { rows } = await db.query(`UPDATE public."Vital_Signs" SET ${changed} WHERE 1=1 AND id=$${i} RETURNING id`, [
    ...Object.values(req.body),
    id,
   ]);

   res.json({
    success: true,
    msg: 'Vital sign was updated successfully.',
    data: rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
