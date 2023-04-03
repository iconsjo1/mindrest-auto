const { isPositiveInteger, isString } = require('../../../../Utils');
module.exports = route => (app, db) => {
 // Create Doctor Schedule
 app.post(route, async (req, res) => {
  try {
   const { time_table } = req.body;
   if (!Array.isArray(time_table) || 0 === time_table.length)
    return res.json({ success: false, msg: 'time table array is not submitted correctly.' });

   delete req.body.time_table;

   const fields = Object.keys(req.body).join(',');
   const values = Object.values(req.body);
   const enc_values = [];

   for (let i = 0; i < values.length; enc_values.push(`$${++i}`));

   const rows = [];
   let currIndexIncrement = enc_values.length;
   let fieldCounter = 0;

   for (let aTimeTable of time_table) {
    const { week_day_id, times } = aTimeTable;
    if (!Array.isArray(times) || 0 === times.length)
     throw new Error(
      'Times table array is not submitted correctly @' + (time_table.indexOf(aTimeTable) + 1)
     );
    if (!isPositiveInteger(week_day_id))
     throw new Error('week_day_id is not a number @' + (time_table.indexOf(aTimeTable) + 1));
    fieldCounter = 1;
    enc_values.push(`$${++currIndexIncrement}`);
    values.push(week_day_id);

    for (let time_schedule of times) {
     const { schedule_start_time, schedule_end_time } = time_schedule;

     if (!isString(schedule_start_time) || !isString(schedule_end_time))
      throw new Error('Times are not strings @' + (time_table.indexOf(aTimeTable) + 1));

     fieldCounter += 2;
     enc_values.push(`$${++currIndexIncrement}`, `$${++currIndexIncrement}`);
     values.push(schedule_start_time, schedule_end_time);
     rows.push(`(${enc_values.join(',')})`);

     enc_values.splice(1 - fieldCounter, fieldCounter - 1);
     fieldCounter -= 2;
    }
    enc_values.pop();
    fieldCounter = 0;
   }
   const { rows: insertedRows } = await db.query(
    `INSERT INTO public."Doctor_Schedules"(${fields},week_day_id,schedule_start_time, schedule_end_time) VALUES${rows.join(
     ','
    )} RETURNING *`,
    values
   );

   res.json({
    success: true,
    msg: `Doctor schedule${1 === insertedRows.length ? '' : 's'} created successfully.`,
    data: insertedRows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
