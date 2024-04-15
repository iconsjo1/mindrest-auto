module.exports = route => app => {
 // Create Doctor Todo
 app.post(route, async (req, res) => {
  try {
   const { todo_columns, doctor_id, therapist_id, role_id } = res.locals;
   const { db, ROLES } = res.locals.utils;

   if (ROLES.THERAPIST === role_id) req.body.doctor_id = therapist_id;
   else if (ROLES.DOCTOR === role_id) req.body.doctor_id = doctor_id;

   const fields = Object.keys(req.body);
   const enc_values = fields.map((_, i) => `$${i + 1}`);

   const { rows } = await db.query(
    `INSERT INTO public."Doctor_Todos"(${fields}) VALUES(${enc_values}) RETURNING ${todo_columns}`,
    Object.values(req.body)
   );
   res.json({
    success: true,
    msg: 'Doctor todo was created successfully.',
    data: rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
