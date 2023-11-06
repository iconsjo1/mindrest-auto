module.exports = route => app => {
 app.post(route, async (req, res) => {
  // UPSERT Doctor Holiday[s]
  try {
   const { db, isPositiveInteger, isSQLDate } = res.locals.utils;

   const { doctor_id, holidays } = req.body;

   if (!isPositiveInteger(doctor_id))
    return res.status(400).json({ success: false, msg: 'doctor_id must be a positive integer.' });

   if (!Array.isArray(holidays) || 0 === holidays.length || !holidays.every(isSQLDate))
    return res.status(400).json({ success: false, msg: 'holidays array was not submitted correctly.' });

   const fields = ['doctor_id', 'date'];
   const values = [doctor_id];
   const enc_values = ['$1'];
   const rows = [];
   let currentIndex = enc_values.length;

   for (const date of holidays) {
    rows.push(`(${[...enc_values, `$${++currentIndex}`]})`);
    values.push(date);
   }

   const { rows: insertedRows } = await db.query(
    `INSERT INTO public."Doctor_Holidays"(${fields})
     VALUES${rows}
     ON CONFLICT DO NOTHING
     RETURNING *`.replace(/\s+/g, ' '),
    values
   );

   res.json({
    success: true,
    no_of_records: insertedRows.length,
    msg: `Doctor Holiday${1 === insertedRows.length ? ' was' : 's were'} created successfully${
     0 === insertedRows.length ? ' [duplicate]' : ''
    }.`,
    data: insertedRows.sort((a, b) => Number(b.id) - Number(a.id)),
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
