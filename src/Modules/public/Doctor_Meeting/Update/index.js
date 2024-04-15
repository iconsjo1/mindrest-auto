module.exports = route => app => {
 // Update Doctor Meeting
 app.put(route, async (req, res) => {
  try {
   const { meeting_columns } = res.locals;
   const { db, isPositiveInteger } = res.locals.utils;

   const { id } = req.query;
   if (!isPositiveInteger(id)) return res.status(404).json({ Success: false, msg: 'Doctor meeting was not found.' });

   const changed = Object.keys(req.body).map((k, i) => `${k} = $${++i}`);

   const { rows } = await db.query(
    `UPDATE public."Doctor_Meetings" SET ${changed} WHERE 1=1 AND id=$${changed.length + 1} RETURNING ${meeting_columns}`,
    [...Object.values(req.body), id]
   );

   res.json({
    success: true,
    msg: 'Doctor meeting was updated successfully.',
    data: rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
