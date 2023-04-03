module.exports = route => (app, db) => {
 // Create Doctor Reply
 app.post(route, async (req, res) => {
  try {
   const { db } = res.locals.utils;
   const fields = Object.keys(req.body).join(',');
   const values = Object.values(req.body);
   const enc_values = [];

   for (let i = 0; i < values.length; enc_values.push(`$${++i}`));
   const { rows } = await db.query(
    `INSERT INTO public."Doctor_Replies"(${fields}) VALUES(${enc_values.join(',')}) RETURNING *`,
    values
   );

   res.json({
    success: true,
    msg: 'Doctor reply created successfully.',
    data: rows,
   });
  } catch ({ messge }) {
   res.json({ success: false, message });
  }
 });
};
