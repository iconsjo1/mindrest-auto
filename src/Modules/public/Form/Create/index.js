module.exports = route => app => {
 // Create Form
 app.post(route, async (req, res) => {
  try {
   const { db } = res.locals.utils;

   const fields = Object.keys(req.body);
   const values = Object.values(req.body);
   const enc_values = [];

   for (let i = 0; i < values.length; enc_values.push(`$${++i}`));

   const newFprm = await db.query(`INSERT INTO public."Forms"(${fields}) VALUES(${enc_values}) RETURNING *`, values);
   res.json({ success: true, msg: 'Form created successfully.', data: newFprm.rows });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
