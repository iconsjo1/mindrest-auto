module.exports = route => app => {
 // Create Package Service
 app.post(route, async (req, res) => {
  let client = null;
  let begun = false;

  try {
   const { db, isPositiveInteger, isValidObject, isPositiveNumber } = res.locals.utils;

   const { package_id, service_list } = req.body;

   if (!isPositiveInteger(package_id)) throw Error('package_id is not a positive integer.');

   if (
    !Array.isArray(service_list) ||
    0 === service_list.length ||
    !service_list.every(
     s => isValidObject(s) && isPositiveInteger(s.service_id) && isPositiveInteger(s.qty) && isPositiveNumber(s.price)
    )
   )
    throw Error('Service list is not submitted correctly.');

   const fields = ['package_id', 'service_id', 'qty', 'price'];

   const values = [package_id];
   const enc_values = ['$1'];

   const rows = [];
   let currentIndex = enc_values.length;

   for (const s of service_list) {
    rows.push(`(${enc_values},${Array.from({ length: 8 }, _ => `$${++currentIndex}`)})`);

    values.push(s.service_id, s.qty, s.price);
   }

   client = await db.connect();

   await client.query('BEGIN TRANSACTION').then(_ => (begun = true));

   await client.query('DELETE FROM public."Package_Services" WHERE 1=1 AND package_id = $1', [package_id]);

   const insertedRows = await client
    .query(`INSERT INTO public."Package_Services"(${fields}) VALUES${rows} RETURNING *`, values)
    .then(({ rows }) => rows.sort((a, b) => parseInt(b.id, 10) - parseInt(a.id, 10)));

   await client.query('COMMIT').then(_ => (begun = false));
   client.release();

   res.json({
    success: true,
    no_of_records: insertedRows.length,
    msg: `Package service${1 === insertedRows.length ? ' was' : 's were'} created successfully.`,
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
