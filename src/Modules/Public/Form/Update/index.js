module.exports = (app, db) => {
 // Update Form
 app.put('/REST/forms', async (req, res) => {
  try {
   const { db } = res.locals.utils;
   const { id } = req.query;
   if (!id) return res.status(404).json({ Success: false, msg: 'Form not found.' });
   const changed = [];

   let i = 1;
   for (let prop in req.body) changed.push(`${prop} = $${i++}`);

   const modifiedForm = await db.query(
    `UPDATE public."Forms" SET ${changed} WHERE 1=1 AND id=$${i} RETURNING *`,
    [...Object.values(req.body), id]
   );
   res.json({
    success: true,
    msg: 'Form updated successfully.',
    data: modifiedForm.rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
