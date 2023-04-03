module.exports = route => (app, db) => {
 // Update Document Category
 app.put(route, async (req, res) => {
  try {
   const { id } = req.query;
   if (!id) return res.status(404).json({ Success: false, msg: 'Document category not found.' });
   const modifiedData = [];

   let i = 1;
   for (let prop in req.body) modifiedData.push(`${prop} = $${i++}`);

   const modifiedDocumentcategory = await db.query(
    `UPDATE public."Document_Categories" SET ${modifiedData.join(
     ','
    )} WHERE 1=1 AND id=$${i} RETURNING *`,
    [...Object.values(req.body), id]
   );
   res.json({
    success: true,
    msg: 'Document category updated successfully.',
    data: modifiedDocumentcategory.rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
