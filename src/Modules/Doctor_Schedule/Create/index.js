module.exports = route => app => {
 // Create Doctor Schedule
 app.post(route, async (req, res) => {
  try {
   const { db, isValidObject, isPositiveInteger, isMilitarytime } = res.locals.utils;

   const { doctor_id, appointment_duration_in_minutes, time_table } = req.body;

   if (!isPositiveInteger(doctor_id))
    return res.status(400).json({ success: false, msg: 'doctor_id must be a positive integer.' });

   if (
    !Array.isArray(time_table) ||
    0 === time_table.length ||
    !time_table.every(
     tt =>
      isValidObject(tt) &&
      isPositiveInteger(tt.week_day_id) &&
      Array.isArray(tt.times) &&
      0 < tt.times.length &&
      tt.times.every(
       ts =>
        isValidObject(ts) &&
        isMilitarytime(ts.schedule_start_time) &&
        isMilitarytime(ts.schedule_end_time) &&
        Number(ts.schedule_start_time.replace(':', '')) <=
         Number(ts.schedule_end_time.replace(':', ''))
      )
    )
   )
    return res.json({ success: false, msg: 'time table array is not submitted correctly.' });

   const fields = [
    'doctor_id',
    'appointment_duration_in_minutes',
    'week_day_id',
    'schedule_start_time',
    'schedule_end_time',
   ];
   const values = [doctor_id, appointment_duration_in_minutes];
   const enc_values = ['$1', '$2'];
   const rows = [];
   let currentIndex = enc_values.length;

   for (const tt of time_table) {
    const row = [...enc_values, `$${++currentIndex}`];
    values.push(tt.week_day_id);
    for (const ts of tt.times) {
     rows.push(`(${[...row, ...Array.from({ length: 2 }, _ => `$${++currentIndex}`)]})`);
     values.push(ts.schedule_start_time, ts.schedule_end_time);
    }
   }

   const { rows: insertedRows } = await db.query(
    `INSERT INTO public."Doctor_Schedules"(${fields}) VALUES${rows} RETURNING *`,
    values
   );

   res.json({
    success: true,
    no_of_records: insertedRows.length,
    msg: `Doctor schedule${1 === insertedRows.length ? ' was' : 's were'} created successfully.`,
    data: insertedRows.sort((a, b) => Number(b.id) < Number(a.id)),
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
