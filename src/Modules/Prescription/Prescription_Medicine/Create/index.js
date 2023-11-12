module.exports = route => app => {
 // Create Prescription Medicine
 app.post(route, async (req, res) => {
  let client = null;
  let begun = false;

  try {
   const { db, isPositiveInteger, isSQLDate, isValidObject, isPositiveNumber } = res.locals.utils;

   const { prescription_id, medicine_list } = req.body;

   if (!isPositiveInteger(prescription_id)) throw Error('prescription_id is not a positive integer.');

   if (
    !Array.isArray(medicine_list) ||
    0 === medicine_list.length ||
    !medicine_list.every(
     m =>
      isValidObject(m) &&
      isPositiveInteger(m.medicine_id) &&
      (null == m.morning || isPositiveNumber(m.morning)) &&
      (null == m.afternoon || isPositiveNumber(m.afternoon)) &&
      (null == m.evening || isPositiveNumber(m.evening)) &&
      (null == m.anytime || isPositiveNumber(m.anytime)) &&
      isPositiveInteger(m.medicine_to_food_id) &&
      isSQLDate(m.start_date) &&
      isSQLDate(m.end_date)
    )
   )
    throw Error('Medicine list is not submitted correctly.');

   const fields = [
    'prescription_id',
    'medicine_id',
    'morning',
    'afternoon',
    'evening',
    'anytime',
    'medicine_to_food_id',
    'start_date',
    'end_date',
   ];

   const values = [prescription_id];
   const enc_values = ['$1'];

   const rows = [];
   let currentIndex = enc_values.length;

   for (const m of medicine_list) {
    rows.push(`(${enc_values},${Array.from({ length: 8 }, _ => `$${++currentIndex}`)})`);

    values.push(
     m.medicine_id,
     m.morning,
     m.afternoon,
     m.evening,
     m.anytime,
     m.medicine_to_food_id,
     m.start_date,
     m.end_date
    );
   }

   client = await db.connect();

   await client.query('BEGIN TRANSACTION').then(_ => (begun = true));

   await client.query('DELETE FROM public."Prescription_Medicines" WHERE 1=1 AND prescription_id = $1', [
    prescription_id,
   ]);

   const insertedRows = await client
    .query(`INSERT INTO public."Prescription_Medicines"(${fields}) VALUES${rows} RETURNING *`, values)
    .then(({ rows }) => rows.sort((a, b) => parseInt(b.id, 10) - parseInt(a.id, 10)));

   await client.query('COMMIT').then(_ => (begun = false));
   client.release();

   res.json({
    success: true,
    no_of_records: insertedRows.length,
    msg: `Prescription medicine${1 === insertedRows.length ? ' was' : 's were'} created successfully.`,
    data: insertedRows,
   });
  } catch ({ message }) {
   let msg = message;
   if (null != client) {
    if (true === begun) {
     try {
      await client.query('ROLLBACK');
     } catch ({ message: rmessage }) {
      msg = rmessage;
     }
    }
    client.release();
   }
   res.json({ success: false, message: msg });
  }
 });
};
