module.exports = route => (app, db) => {
 // UPSERT Bill Service[s]
 app.post(route, async (req, res) => {
  try {
   const { db, isValidObject, isPositiveInteger, isEString } = res.locals.utils;

   const { bill_id, service_list } = req.body;

   if (!isPositiveInteger(bill_id))
    return res.status(400).json({ success: false, msg: 'bill_id must be a positive integer.' });
   if (
    !Array.isArray(service_list) ||
    0 === service_list.length ||
    !service_list.every(
     sl =>
      isValidObject(sl) &&
      isPositiveInteger(sl.service_id) &&
      (null == sl.no_of_sessions || isPositiveInteger(sl.no_of_sessions)) &&
      isEString(sl.notes)
    )
   )
    return res.json({ success: false, msg: 'Service list is not submitted correctly.' });

   const fields = ['bill_id', 'service_id', 'notes', 'no_of_sessions'];
   const values = [bill_id];
   const enc_values = ['$1'];
   const rows = [];
   let currentIndex = enc_values.length;

   for (const s of service_list) {
    const row_enc = Array.from({ length: 2 }, _ => `$${++currentIndex}`);
    values.push(s.service_id, s.notes);
    (s => {
     (function () {
      Object.values(arguments).forEach(arg => {
       if (null == s[arg]) row_enc.push('DEFAULT');
       else {
        row_enc.push(`$${++currentIndex}`);
        values.push(s[arg]);
       }
      });
      rows.push(`(${[...enc_values, ...row_enc]})`);
     })('no_of_sessions');
    })(s);
   }

   const { rows: insertedRows } = await db.query(
    `INSERT INTO public."Bill_Services"(${fields}) VALUES${rows} RETURNING *`,
    values
   );

   res.json({
    success: true,
    msg: `Bill service${1 === insertedRows.length ? ' was' : 's were'} created successfully.`,
    data: insertedRows.sort((a, b) => Number(b.id) - Number(a.id)),
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
