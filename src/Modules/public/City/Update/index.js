module.exports = route => app => {
 // Update City
 app.put(route, async (req, res) => {
  try {
   const { db, isPositiveInteger } = res.locals.utils;

   const { id } = req.query;
   if (!isPositiveInteger(id)) return res.status(404).json({ Success: false, msg: 'City was not found.' });

   let i = 1;
   const changed = [];
   for (let prop in req.body) changed.push(`${prop} = $${i++}`);

   const { rows } = await db.query(`UPDATE public."Cities" SET ${changed} WHERE 1=1 AND id=$${i} RETURNING *`, [
    ...Object.values(req.body),
    id,
   ]);

   res.json({ success: true, msg: 'City was updated successfully.', data: rows });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
