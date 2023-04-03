const { isPositiveInteger, isPositiveNumber } = require('../../../../../Utils');

module.exports = route => (app, db) => {
 // UPSERT Patient Service Discount[s]
 app.post(route, async (req, res) => {
  try {
   const { service_discount_list } = req.body;
   if (!Array.isArray(service_discount_list) || 0 === service_discount_list.length)
    return res.json({ success: false, msg: 'Service discount list is not submitted correctly.' });

   delete req.body.service_discount_list;

   const fields = Object.keys(req.body).join(',');
   const values = Object.values(req.body);
   const enc_values = [];

   for (let i = 0; i < values.length; enc_values.push(`$${++i}`));

   const rows = [];
   let currIndexIncrement = enc_values.length;

   for (let service_discount of service_discount_list) {
    const { service_id, discount } = service_discount;

    if (!isPositiveInteger(service_id) || !isPositiveNumber(discount))
     throw new Error(
      'Discount number {' + (service_discount_list.indexOf(service_discount) + 1) + '} is not valid'
     );

    const discountPropCount = Object.keys(service_discount).length;

    // ($1,$2,$3),($1,$4,$5)
    for (let i = 0; i++ < discountPropCount; enc_values.push(`$${++currIndexIncrement}`));

    rows.push(`(${enc_values.join(',')})`);

    // Initialize new row
    enc_values.splice(0 - discountPropCount, discountPropCount); // remove items to reset counter
    values.push(service_id, discount);
   }

   const newPatientServiceDiscounts = await db.query(
    `INSERT INTO public."Patient_Service_Discounts"(${fields},service_id,discount) VALUES${rows.join(
     ','
    )} RETURNING *`.replace(/\s+/g, ' '),
    values
   );

   res.json({
    success: true,
    msg: `Patient service discount${
     1 === newPatientServiceDiscounts.rows.length ? '' : 's'
    } created successfully.`,
    data: newPatientServiceDiscounts.rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
