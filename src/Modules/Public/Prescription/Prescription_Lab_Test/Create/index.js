module.exports = route => (app, db) => {
 // Create Prescription Lab Test[s]
 app.post(route, async (req, res) => {
  try {
   const { db, isPositiveInteger } = res.locals.utils;
   const { prescription_id } = req.body;
   if (!isPositiveInteger(prescription_id))
    throw new Error('Prescription_id must be a positive integer');

   const labsTestIds = [...new Set(req.body.labsTestIds)];

   if (0 === labsTestIds.length || !labsTestIds.every(id => isPositiveInteger(id)))
    return res.json({ success: false, msg: 'LabTestIds array is not submitted correctly.' });
   delete req.body.labsTestIds;
   const { rows: dbLabTestIds } = await db.query({
    text: 'SELECT id FROM public."Lab_Tests" ORDER BY 1 DESC',
    rowMode: 'array',
   });

   const flatdbLabTestIds = dbLabTestIds.flat(1);
   labsTestIds.forEach(id => {
    if (!(flatdbLabTestIds.includes(id) || flatdbLabTestIds.includes(id.toString())))
     throw new Error('one of the labTest ids is going to violate foreign key constraint. ');
   });

   const fields = ['prescription_id', 'lab_test_id'].join(',');
   const values = [];
   const enc_values = ['$1'];

   const rows = [];
   let currIndexIncrement = enc_values.length;

   for (let id of labsTestIds) {
    // 1 field
    rows.push(`(${enc_values.join(',')},$${++currIndexIncrement})`);
    values.push(id);
   }
   values.unshift(prescription_id);

   const { rows: insertedRows } = await db.query(
    `INSERT INTO public."Prescription_Tests"(${fields}) VALUES${rows.join(',')} RETURNING *`,
    values
   );

   res.json({
    success: true,
    no_of_records: insertedRows.length,
    msg: `Prescription lab test${1 === insertedRows.length ? '' : 's'} created successfully.`,
    data: insertedRows.sort((a, b) => b.id - a.id),
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
