module.exports = route => app => {
 // Create Patients_Notes
 app.post(route, async (req, res) => {
  try {
   const {
    locals: {
     utils: { db, ROLES },
     user_id,
    },
   } = res;

   req.body.created_by = user_id;
   const fields = Object.keys(req.body);
   const values = Object.values(req.body);
   const enc_values = [];

   for (let i = 0; i < values.length; enc_values.push(`$${++i}`));

   const { rows } = await db.query(
    `INSERT INTO public."Patients_Notes"(${fields}) VALUES(${enc_values}) RETURNING *`,
    values
   );
   res.json({ success: true, msg: 'Patient note was created successfully.', data: rows });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
