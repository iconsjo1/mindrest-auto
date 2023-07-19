module.exports = route => app => {
 // Create Service Category
 app.post(route, async (req, res) => {
  try {
   const { db } = res.locals.utils;

   const fields = Object.keys(req.body);
   const values = Object.values(req.body);
   const enc_values = [];

   for (let i = 0; i < values.length; enc_values.push(`$${++i}`));

   const { rows } = await db.query(
    `INSERT INTO public."Service_Categories"(${fields}) VALUES(${enc_values}) RETURNING *`,
    values
   );
   res.json({
    success: true,
    msg: 'Service category created successfully.',
    data: rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
