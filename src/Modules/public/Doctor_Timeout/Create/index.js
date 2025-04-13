module.exports = route => app => {
 // Create Doctor Timeout
 app.post(route, async (req, res) => {
  try {
   const { db } = res.locals.utils;
   const fields = Object.keys(req.body);
   const enc_values = fields.map((_, i) => `$${i + 1}`);

   const { rows } = await db.query(
    `INSERT INTO public."Doctor_Timeouts"(${fields}) VALUES(${enc_values}) RETURNING *,fn_calc_end_time(start,slots_count) end`,
    Object.values(req.body)
   );
   res.json({ success: true, msg: 'Doctor timeout was created successfully.', data: rows });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
