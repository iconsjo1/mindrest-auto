module.exports = route => app => {
 // Create Bill
 app.post(route, async (req, res) => {
  let client = null;
  let begun = false;
  try {
   const {
    db,
    isPositiveInteger,
    env: {
     ERP: { CUSTOMER, INVOICE, SERVICE },
    },
   } = res.locals.utils;

   const { appointment_id, ...bodyRest } = req.body;
   if (!isPositiveInteger(appointment_id)) throw Error('Appointment id is not a positive integer.');

   const { rows: erpCustomerDBData } = await db.query(
    `WITH s AS (
        SELECT id, service_ref, service_charge
        FROM public."Services"
     )
     SELECT
        u.customer_ref,
        c.country_id,
        s.service_ref,
        s.service_charge - CASE is_percentage
          WHEN true THEN s.service_charge * (1 - psd.discount / 100::numeric)
          WHEN false THEN psd.discount
          ELSE 0
        END rate
     FROM
        public."Users" u
        LEFT JOIN public."Contacts" c ON c.user_id = u.id
        JOIN public."Patients" p ON p.user_id = u.id
        JOIN public."Appointments" a ON a.patient_id = p.id
        JOIN s ON a.service_id = s.id
        LEFT JOIN public."Patient_Service_Discounts" psd USING(patient_id, service_id)
     WHERE a.id = $1
        AND a.bill_id ISNULL`,
    [appointment_id]
   );

   if (0 === erpCustomerDBData.length) throw Error('Appointment was not found.');

   const [{ customer_ref, country_id, service_ref, rate }] = erpCustomerDBData;

   await CUSTOMER.read(customer_ref).then(async ({ cust_data }) => {
    if (null == cust_data) {
     await CUSTOMER.create(customer_ref, country_id).then(newCust => {
      if ('exception' in newCust) throw Error(newCust.exception);
     });
    }
   });

   await SERVICE.read(service_ref).then(async ({ item_data }) => {
    if (null == item_data) {
     await SERVICE.create(service_ref).then(newServe => {
      if ('exception' in newServe) throw Error(newServe.exception);
     });
    }
   });

   const invoice = await INVOICE.create(customer_ref, service_ref, rate).then(({ success, invoice_data }) => {
    if (false === success) throw Error(invoice_data.message);

    if ('exc_type' in invoice_data)
     throw Error('exception' in invoice_data ? invoice_data.exception : invoice_data._server_messages[0].message);

    return invoice_data;
   });

   bodyRest.invoice_ref = invoice.name;

   const fields = Object.keys(bodyRest);
   const $enc = fields.map((_, i) => `$${i + 1}`);

   client = await db.connect();
   await client.query('BEGIN').then(() => (begun = true));

   const {
    rows: [bill],
   } = await client.query(`INSERT INTO public."Bills"(${fields}) VALUES(${$enc}) RETURNING *`, Object.values(bodyRest));
   const {
    rows: [appointment],
   } = await client.query('UPDATE public."Appointments" SET bill_id = $1 WHERE id = $2 RETURNING *', [
    bill.id,
    appointment_id,
   ]);
   await client.query('COMMIT').then(() => (begun = false));

   res.json({ success: true, msg: 'Bill was created successfully.', data: { bill, appointment, invoice } });
  } catch ({ message }) {
   res.json({ success: false, message });
  } finally {
   if (null != client) {
    if (true === begun) {
     try {
      await client.query('ROLLBACK');
     } catch ({ message: rmessage }) {
      throw Error(rmessage);
     }
    }
    client.release();
   }
  }
 });
};
