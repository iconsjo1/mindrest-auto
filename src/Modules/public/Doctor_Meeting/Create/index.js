module.exports = route => app => {
 // Create Doctor Meeting
 app.post(route, async (req, res) => {
  try {
   const { meeting_columns } = res.locals;
   const { db } = res.locals.utils;

   const fields = Object.keys(req.body);
   const enc_values = fields.map((_, i) => `$${i + 1}`);

   const { rows } = await db.query(
    `INSERT INTO public."Doctor_Meetings"(${fields}) VALUES(${enc_values}) RETURNING ${meeting_columns}`,
    Object.values(req.body)
   );
   res.json({
    success: true,
    msg: 'Doctor meeting was created successfully.',
    data: rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
