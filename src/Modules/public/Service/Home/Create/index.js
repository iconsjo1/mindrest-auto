module.exports = route => app => {
 // Create Service
 app.post(route, async (req, res) => {
  try {
   const {
    db,
    env: {
     ERP: { SERVICE },
    },
   } = res.locals.utils;

   const fields = Object.keys(req.body);
   const values = Object.values(req.body);
   const enc_values = values.map((_, i) => `$${++i}`);

   const dispDate = await db
    .query(`INSERT INTO public."Services"(${fields}) VALUES(${enc_values}) RETURNING *`, values)
    .then(async ({ rows }) => {
     if (0 === rows.length) throw Error('Cannot insert service.');
     return {
      service: rows[0],
      service_ref: await SERVICE.create(rows[0].service_ref),
     };
    });

   res.json({ success: true, msg: 'Service was created successfully.', data: dispDate });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
