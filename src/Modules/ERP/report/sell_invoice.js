module.exports = route => app => {
 // Read Log[s]
 app.get(route, async (req, res) => {
  try {
   const {
    db,
    isPositiveInteger,
    pgRowMode,
    env: {
     ERP: { INVOICE },
    },
   } = res.locals.utils;

   const { patient_id } = req.query;

   if (!isPositiveInteger(patient_id)) throw Error('patient_id should be positive integer.');

   const bills = await db
    .query(
     pgRowMode(
      `SELECT invoice_ref FROM public."Appointments" a 
        JOIN public."Bills" b ON b.id =a.bill_id   
        WHERE patient_id =$1 AND a.is_deleted =false`,
      [patient_id]
     )
    )
    .then(({ rows }) => rows.flat());

   const invoices = await Promise.all(bills.map(async b => await INVOICE.read(b)));

   res.json({
    success: true,
    data: invoices.map(item => item.data),
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
