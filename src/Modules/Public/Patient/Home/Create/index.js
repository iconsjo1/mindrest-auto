module.exports = route => (app, db) => {
 // Create Patient
 app.post(route, async (req, res) => {
  try {
   const { db } = res.locals.utils;

   const fields = Object.keys(req.body);
   const values = Object.values(req.body);
   const enc_values = [];

   for (let i = 0; i < values.length; enc_values.push(`$${++i}`));

   const { rows } = await db.query(
    `INSERT INTO public."Patients"(${fields}) VALUES(${enc_values}) RETURNING *`,
    values
   );
   res.json({ success: true, msg: 'Patient created successfully.', data: rows });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
