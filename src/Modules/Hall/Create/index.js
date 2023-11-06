module.exports = route => app => {
 // Create Hall
 app.post(route, async (req, res) => {
  try {
   const { db } = res.locals.utils;

   const fields = Object.keys(req.body);
   const values = Object.values(req.body);
   const enc_values = [];

   for (let i = 0; i < values.length; enc_values.push(`$${++i}`));

   const { rows } = await db.query(`INSERT INTO public."Halls"(${fields}) VALUES(${enc_values}) RETURNING *`, values);

   res.json({ success: true, msg: 'Hall created successfully.', data: rows });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
