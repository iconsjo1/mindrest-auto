module.exports = (app, db) => {
 // Update Country
 app.put('/REST/countries', async (req, res) => {
  try {
   const { db } = res.locals.utils;

   const { id } = req.query;
   if (!id) return res.status(404).json({ Success: false, msg: 'Country not found.' });

   const changed = [];

   let i = 1;
   for (let prop in req.body) changed.push(`${prop} = $${i++}`);

   const modifiedCountry = await db.query(
    `UPDATE public."Countries" SET ${changed} WHERE 1=1 AND id=$${i} RETURNING *`,
    [...Object.values(req.body), id]
   );

   res.json({ success: true, msg: 'Country updated successfully.', data: modifiedCountry.rows });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
