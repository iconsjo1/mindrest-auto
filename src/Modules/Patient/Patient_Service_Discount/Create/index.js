module.exports = route => app => {
 // UPSERT Patient Service Discount[s]
 app.post(route, async (req, res) => {
  try {
   const { db, isValidObject, isPositiveInteger, isPositiveNumber } = res.locals.utils;

   const { patient_id, service_discount_list } = req.body;

   if (!isPositiveInteger(patient_id))
    return res.status(400).json({ success: false, msg: 'patient_idis not a positive integer.' });

   if (
    !Array.isArray(service_discount_list) ||
    0 === service_discount_list.length ||
    !service_discount_list.every(
     sd => isValidObject(sd) && isPositiveInteger(sd.service_id) && isPositiveNumber(sd.discount)
    )
   )
    return res
     .status(400)
     .json({ success: false, msg: 'Service discount list is not submitted correctly.' });

   const fields = ['patient_id', 'service_id', 'discount'];
   const values = [patient_id];
   const enc_values = ['$1'];

   const rows = [];
   let currentIndex = enc_values.length;

   for (const sd of service_discount_list) {
    rows.push(`(${enc_values},${Array.from({ length: 2 }, _ => `$${++currentIndex}`)})`);
    values.push(sd.service_id, sd.discount);
   }

   const { rows: insertedRows } = await db.query(
    `INSERT INTO public."Patient_Service_Discounts"(${fields}) VALUES${rows} RETURNING *`,
    values
   );

   res.json({
    success: true,
    msg: `Patient service discount${
     1 === insertedRows.length ? ' was' : 's were'
    } created successfully.`,
    data: insertedRows.sort((a, b) => parseInt(b.id) - parseInt(a.id)),
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
