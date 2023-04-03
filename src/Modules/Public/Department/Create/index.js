module.exports = (app, db) => {
 // Create Department
 app.post('/REST/departments', async (req, res) => {
  try {
   const fields = Object.keys(req.body).join(',');
   const values = Object.values(req.body);
   const enc_values = [];

   for (let i = 0; i < values.length; enc_values.push(`$${++i}`));

   const newDepartment = await db.query(
    `INSERT INTO public."Departments"(${fields}) VALUES(${enc_values.join(',')}) RETURNING *`,
    values
   );
   res.json({ success: true, msg: 'Department created successfully.', data: newDepartment.rows });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
