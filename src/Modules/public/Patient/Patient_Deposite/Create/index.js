module.exports = route => app => {
 // Create Patient Deposite
 app.post(route, async (req, res) => {
  try {
   const {
    db,
    isString,
    env: {
     ERP: { PAYMENTENTRY },
    },
   } = res.locals.utils;
   const { account, method_id, bill_id, amount } = req.body;

   const { rows: entryIdentifiers } = await db.query(
    `SELECT 
             (SELECT dm.method_name 
              FROM public."Deposite_Methods" dm 
              WHERE dm.id = $2) method_name, 
             b.invoice_ref, 
             u.customer_ref
           FROM public."Appointments" a
           JOIN public."Bills" b ON a.bill_id = b.id
           JOIN public."Patients" p ON a.patient_id = p.id
           JOIN public."Users" u ON p.user_id = u.id
           WHERE b.id = $1`,
    [bill_id, method_id]
   );

   if (0 === entryIdentifiers.length) throw new Error('Failed to retrieve payment entry identifiers.');

   const [{ method_name, customer_ref, invoice_ref }] = entryIdentifiers;
   const entry = { account, amount, method_name, customer_ref, invoice_ref };

   const payment_entry = await PAYMENTENTRY.create.call(entry).then(({ success, paymententry_data }) => {
    if (false === success) throw new Error(paymententry_data.message);

    if ('exc_type' in paymententry_data)
     throw new Error(
      'exception' in paymententry_data
       ? paymententry_data.exception
       : isString(paymententry_data._server_messages)
         ? JSON.parse(paymententry_data._server_messages)[0].message
         : paymententry_data._server_messages[0].message
     );

    return paymententry_data;
   });

   const insertFields = {
    bill_id,
    method_id,
    deposite_ref: payment_entry.name,
   };
   const fields = Object.keys(insertFields);
   const $enc = fields.map((_, i) => `$${i + 1}`);

   const { rows } = await db.query(
    `INSERT INTO public."Patient_Deposites"(${fields}) VALUES(${$enc}) RETURNING *`,
    Object.values(insertFields)
   );

   res.json({
    success: true,
    msg: 'Patient deposite was created successfully.',
    data: { diposite: rows[0], payment_entry },
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
