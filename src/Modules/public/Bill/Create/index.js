module.exports = route => app => {
 // Create Bill
 app.post(route, async (req, res) => {
  let client = null;
  let begun = false;
  try {
   const { db, isPositiveInteger, ERPnext } = res.locals.utils;

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

   const erpCustomer = new ERPnext.Customer(customer_ref);
   await erpCustomer.safeCreateERP(country_id);

   const erpService = new ERPnext.Service(service_ref);
   await erpService.safeCreateERP();

   const erpBill = new ERPnext.Bill();
   const invoice = await erpBill.CreateERP(customer_ref, service_ref, rate);

   bodyRest.invoice_ref = erpBill.ref;

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
