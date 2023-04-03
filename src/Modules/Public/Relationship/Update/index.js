const { isPositiveInteger } = require('../../../../Utils');

module.exports = route => (app, db) => {
 // Update Relationship
 app.put(route, async (req, res) => {
  try {
   const { id } = req.query;
   if (!isPositiveInteger(id))
    return res.status(404).json({ Success: false, msg: 'Relationship not found.' });

   const modifiedData = [];

   let i = 1;
   for (let prop in req.body) modifiedData.push(`${prop} = $${i++}`);

   const modifiedRelationship = await db.query(
    `UPDATE public."Relationships" SET ${modifiedData.join(
     ','
    )} WHERE 1=1 AND id=$${i} RETURNING *`,
    [...Object.values(req.body), id]
   );

   res.json({
    success: true,
    msg: 'Relationship updated successfully.',
    data: modifiedRelationship.rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
