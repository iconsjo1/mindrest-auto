module.exports = route => app => {
 // Update Doctor Timeout
 app.put(route, async (req, res) => {
  try {
   const { db, isPositiveInteger } = res.locals.utils;

   const { id } = req.query;
   if (!isPositiveInteger(id)) return res.status(404).json({ Success: false, msg: 'Doctor timeout not found.' });

   const changed = Object.keys(req.body).map((k, i) => `${k} = $${++i}`);

   const { rows } = await db.query(
    `UPDATE public."Doctor_Timeouts" SET ${changed} WHERE 1=1 AND id=$${changed.length + 1} RETURNING *`,
    [...Object.values(req.body), id]
   );

   res.json({
    success: true,
    msg: 'Doctor timeout was updated successfully.',
    data: rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
