module.exports = route => app => {
 // Update Doctor Schedule
 app.put(route, async (req, res) => {
  try {
   const { db, isPositiveInteger } = res.locals.utils;

   const { id } = req.query;
   if (!isPositiveInteger(id))
    return res.status(404).json({ Success: false, msg: 'Doctor schedule not found.' });

   let i = 1;
   const changed = [];
   for (let prop in req.body) changed.push(`${prop} = $${i++}`);

   const { rows } = await db.query(
    `UPDATE public."Doctor_Schedules" SET ${changed} WHERE 1=1 AND id=$${i} RETURNING *`,
    [...Object.values(req.body), id]
   );
   res.json({ success: true, msg: 'Doctor schedule updated successfully.', data: rows });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
