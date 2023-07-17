module.exports = route => (app, db) => {
 // Create Document Category
 app.post(route, async (req, res) => {
  try {

    const { db} = res.locals.utils;
    
   const fields = Object.keys(req.body);
   const values = Object.values(req.body);
   const enc_values = [];

   for (let i = 0; i < values.length; enc_values.push(`$${++i}`));

   const newDocumentCategory = await db.query(
    `INSERT INTO public."Document_Categories"(${fields}) VALUES(${enc_values}) RETURNING *`,
    values
   );
   res.json({
    success: true,
    msg: 'Document category created successfully.',
    data: newDocumentCategory.rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
