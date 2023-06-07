module.exports = route => app => {
 app.post(route, async (req, res) => {
  // UPSERT Doctor Holiday[s]
  try {
   const { db, isPositiveInteger, isSQLDate } = res.locals.utils;

   const { doctor_id, holidays } = req.body;

   if (!isPositiveInteger(doctor_id))
    return res.status(400).json({ success: false, msg: 'doctor_id must be a positive integer.' });

   if (!Array.isArray(holidays) || 0 === holidays.length || !holidays.every(h => isSQLDate(h)))
    return res
     .status(400)
     .json({ success: false, msg: 'holidays array was not submitted correctly.' });

   const values = [];
   const enc_values = ['$1'];
   const rows = [];

   let currentIndex = enc_values.length;

   for (let date of holidays) {
    rows.push(`(${enc_values},$${++currentIndex})`);
    values.push(date);
   }

   values.unshift(doctor_id);

   const { rows: insertedRows } = await db.query(
    `INSERT INTO public."Doctor_Holidays"(doctor_id, date)
     VALUES${rows}
     ON CONFLICT DO NOTHING
     RETURNING *`.replace(/\s+/g, ' '),
    values
   );

   res.json({
    success: true,
    no_of_records: insertedRows.length,
    msg: `Doctor Holiday${1 === insertedRows.length ? ' was' : 's were'} created successfully${
     0 === insertedRows.length ? ' [duplicae]' : ''
    }.`,
    data: insertedRows.sort((a, b) => parseInt(b.id) - parseInt(a.id)),
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
