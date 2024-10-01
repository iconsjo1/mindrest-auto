module.exports = route => app => {
 // Read Log[s]
 app.get(route, async (req, res) => {
  try {
   const {
    db,
    isPositiveInteger,
    env: {
     ERP: { INVOICE },
    },
   } = res.locals.utils;

   const { patient_id } = req.query;

   if (!isPositiveInteger(patient_id)) throw Error('patient_id should be positive integer.');

   const { rows: bills } = await db.query(
    `SELECT invoice_ref  ,bill_id,appointment_id,appointment_date,service_name FROM public."V_Doctor_Patients" a
    JOIN public."Bills" b ON b.id =a.bill_id 
        WHERE patient_id =$1 `,
    [patient_id]
   );

   const invoices = await Promise.all(bills.map(b => INVOICE.read(b.invoice_ref))).then(rows =>
    rows.map(item => item.data)
   );

   const merged = bills
    .filter(b => invoices.some(inv => inv.name == b.invoice_ref))
    .map(b => {
     const itemY = invoices.find(item => item.name == b.invoice_ref);
     return { ...b, posting_date: itemY.posting_date, total: itemY.total };
    });

   res.json({
    success: true,
    msg: `sell invoice${1 === merged.length ? ' was' : 's were'} retrieved successfully.`,
    data: merged,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
