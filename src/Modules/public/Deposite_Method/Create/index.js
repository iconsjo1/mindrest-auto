module.exports = route => app => {
 // Create Deposite Method
 app.post(route, async (req, res) => {
  try {
   const {
    db,
    pgRowMode,
    env: {
     ERP: { PAYMENTMODE },
    },
   } = res.locals.utils;

   const paymentModeType = await db
    .query(
     pgRowMode('SELECT method_type FROM public."Deposite_Method_Types" WHERE id = $1', [
      req.body.deposite_method_type_id,
     ])
    )
    .then(({ rows }) => {
     if (0 === rows.length) throw Error('DB Type does not exist.');
     return rows[0][0];
    });

   const fields = Object.keys(req.body);
   const $enc = fields.map((_, i) => `$${i + 1}`);

   try {
    const x = await PAYMENTMODE.read(paymentModeType);
   } catch {
    await PAYMENTMODE.create(req.body.method, paymentModeType);
   }

   const { rows } = await db.query(
    `INSERT INTO public."Deposite_Methods"(${fields}) VALUES(${$enc}) RETURNING *`,
    Object.values(req.body)
   );
   res.json({
    success: true,
    msg: 'Deposite method was created successfully.',
    data: rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
