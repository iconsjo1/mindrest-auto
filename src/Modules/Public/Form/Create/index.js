module.exports = (app, db) => {
 // Create Form
 app.post('/REST/forms', async (req, res) => {
  try {
   const fields = Object.keys(req.body).join(',');
   const values = Object.values(req.body);
   const enc_values = [];

   for (let i = 0; i < values.length; enc_values.push(`$${++i}`));

   const newFprm = await db.query(
    `INSERT INTO public."Forms"(${fields}) VALUES(${enc_values.join(',')}) RETURNING *`,
    values
   );
   res.json({ success: true, msg: 'Form created successfully.', data: newFprm.rows });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
