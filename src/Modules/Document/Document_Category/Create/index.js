module.exports = route => app => {
 // Create Document Category
 app.post(route, async (req, res) => {
  const { db } = res.locals.utils;
  try {
   const fields = Object.keys(req.body);
   const values = Object.values(req.body);
   const enc_values = [];

   for (let i = 0; i < values.length; enc_values.push(`$${++i}`));

   const { rows } = await db.query(
    `INSERT INTO public."Document_Categories"(${fields}) VALUES(${enc_values.join(
     ','
    )}) RETURNING *`,
    values
   );

   res.json({ success: true, msg: 'Document category was created successfully.', data: rows });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
