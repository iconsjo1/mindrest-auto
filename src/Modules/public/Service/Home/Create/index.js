module.exports = route => app => {
 // Create Service
 app.post(route, async (req, res) => {
  try {
   const { db } = res.locals.utils;

   const fields = Object.keys(req.body);
   const $enc = fields.map((_, i) => `$${i + 1}`);

   const { rows } = await db.query(
    `INSERT INTO public."Services"(${fields}) VALUES(${$enc}) RETURNING *`,
    Object.values(req.body)
   );

   res.json({ success: true, msg: 'Service was created successfully.', data: rows });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
