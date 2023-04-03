module.exports = route => (app, db) => {
 // Create Vital Sign
 app.post(route, async (req, res) => {
  try {
   const fields = Object.keys(req.body).join(',');
   const values = Object.values(req.body);
   const enc_values = [];

   for (let i = 0; i < values.length; enc_values.push(`$${++i}`));

   const newVitalSign = await db.query(
    `INSERT INTO public."Vital_Signs"(${fields}) VALUES(${enc_values.join(',')}) RETURNING id`,
    values
   );
   const { id } = newVitalSign.rows[0];
   if (!id) {
    throw new Error("Vital Signature wasn't added properly");
   }
   const vitalSign_BMI = await db.query('SELECT * FROM public."V_Vital_Signs" WHERE id = $1', [id]);

   res.json({ success: true, msg: 'Vital sign created successfully.', data: vitalSign_BMI.rows });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
