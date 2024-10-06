module.exports = route => app => {
 // Create Patient Deposite
 app.post(route, async (req, res) => {
  try {
   const { db, isString, isPositiveNumber, isPositiveInteger, ERPnext } = res.locals.utils;
   const { account, method_id, bill_id, amount } = req.body;

   if (!(isString(account) || [method_id, bill_id].every(isPositiveInteger) || isPositiveNumber(amount)))
    return res.status(400).json('illigal set of parameters.');

   const { rows: entryIdentifiers } = await db.query(
    `SELECT 
        (SELECT dm.method
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

   if (0 === entryIdentifiers.length) throw Error('Failed to retrieve payment entry identifiers.');

   const [{ method, customer_ref, invoice_ref }] = entryIdentifiers;

   const erpPaymentEntry = new ERPnext.PaymentEntry(account, amount, method, customer_ref);
   erpPaymentEntry.addReference(invoice_ref, amount);

   const payment_entry = await erpPaymentEntry.CreateERP();

   const insertFields = {
    bill_id,
    method_id,
    deposite_amount: amount,
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
