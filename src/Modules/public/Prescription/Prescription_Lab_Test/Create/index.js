module.exports = route => app => {
 // Create Prescription Lab Test[s]
 app.post(route, async (req, res) => {
  try {
   const { db, isPositiveInteger, isIterable } = res.locals.utils;

   const { prescription_id, labsTestIds } = req.body;

   if (!isPositiveInteger(prescription_id)) throw new Error('Prescription_id must be a positive integer');

   const labsTestIdsArray = isIterable(labsTestIds)
    ? Array.from([...new Set(labsTestIds)].filter(isPositiveInteger), id => parseInt(id, 10)).sort((a, b) => b - a)
    : [];

   if (0 === labsTestIdsArray.length)
    return res.json({ success: false, msg: 'LabTestIds array is not submitted correctly.' });

   const countLAbTests = await db
    .query({
     text: 'SELECT COUNT(1) FROM public."Lab_Tests" WHERE id = ANY($1)',
     values: [labsTestIdsArray],
     rowMode: 'array',
    })
    .then(({ rows }) => (1 === rows.length ? parseInt(rows[0][0], 10) : -1));

   if (labsTestIdsArray.length !== countLAbTests)
    throw new Error('one of the labTest ids is going to violate foreign key constraint. ');

   const fields = ['prescription_id', 'lab_test_id'];
   const values = [prescription_id];
   const enc_values = ['$1'];

   const rows = [];
   let currIndex = enc_values.length;

   for (let id of labsTestIds) {
    rows.push(`(${[...enc_values, `$${++currIndex}`]})`);
    values.push(id);
   }

   const { rows: insertedRows } = await db.query(
    `INSERT INTO public."Prescription_Lab_Tests"(${fields}) VALUES${rows} RETURNING *`,
    values
   );

   res.json({
    success: true,
    no_of_records: insertedRows.length,
    msg: `Prescription lab test${1 === insertedRows.length ? ' was' : 's were'} created successfully.`,
    data: insertedRows.sort((a, b) => parseInt(b.id) - parseInt(a.id)),
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
