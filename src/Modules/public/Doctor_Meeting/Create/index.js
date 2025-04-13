module.exports = route => app => {
 // Create Doctor Meeting
 app.post(route, async (req, res) => {
  try {
   const { meeting_columns, doctor_id, therapist_id, role_id } = res.locals;
   const { db, ROLES } = res.locals.utils;

   if (ROLES.THERAPIST === role_id) req.body.requester_id = therapist_id;
   else if (ROLES.DOCTOR === role_id) req.body.requester_id = doctor_id;

   const fields = Object.keys(req.body);
   const enc_values = fields.map((_, i) => `$${i + 1}`);

   const { rows } = await db.query(
    `INSERT INTO public."Doctor_Meetings"(${fields}) VALUES(${enc_values}) RETURNING ${meeting_columns}`,
    Object.values(req.body)
   );
   res.json({ success: true, msg: 'Doctor meeting was created successfully.', data: rows });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
