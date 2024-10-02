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
   const fields = Object.keys(req.body);
   const $enc = fields.map((_, i) => `$${i + 1}`);

   const paymentModeType = await db
    .query(
     pgRowMode('SELECT method_type FROM public."Deposite_Method_Types" WHERE id = $1', [
      req.body.deposite_method_types_id,
     ])
    )
    .then(({ rows }) => {
     if (0 === rows.length) throw Error('Type does not exist.');
     return rows[0][0];
    });

   await PAYMENTMODE.read(paymentModeType).then(async ({ paymentmode_data }) => {
    if ('exp_type' in paymentmode_data)
     await PAYMENTMODE.create(restBody.metod, paymentModeType).then(({ success, paymentmode_data }) => {
      if (false === success) throw Error(paymentmode_data.message);

      if ('exception' in paymentmode_data) throw Error(paymentmode_data.exception);
     });
   });

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
