const { isPositiveInteger } = require('../../../../Utils');

module.exports = route => (app, db) => {
 // Update Hall
 app.put(route, async (req, res) => {
  try {
   const { id } = req.query;
   if (!isPositiveInteger(id))
    return res.status(404).json({ Success: false, msg: 'Hall not found.' });

   const modifiedData = [];

   let i = 1;
   for (let prop in req.body) modifiedData.push(`${prop} = $${i++}`);

   const modifiedHall = await db.query(
    `UPDATE public."Halls" SET ${modifiedData.join(',')} WHERE 1=1 AND id=$${i} RETURNING *`,
    [...Object.values(req.body), id]
   );

   res.json({ success: true, msg: 'Hall updated successfully.', data: modifiedHall.rows });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
