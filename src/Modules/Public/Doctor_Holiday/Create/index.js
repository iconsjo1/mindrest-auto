module.exports = route => (app, db) => {
 app.post(route, async (req, res) => {
  // UPSERT Doctor Holidays
  try {
   const { doctor_id, holidays } = req.body;

   if (!Array.isArray(holidays) || 0 === holidays.length)
    return res.json({ success: false, msg: 'holidays array is not submitted correctly.' });

   delete req.body.holidays;

   const values = [doctor_id];
   const enc_values = ['$1'];

   const rows = [];
   let indexIncrement = enc_values.length;

   for (let date of holidays) {
    if (isNaN(Date.parse(date))) throw new Error('Invalid date: ' + date);
    enc_values.push(`$${++indexIncrement}`);
    rows.push(`(${enc_values.join(',')})`);
    enc_values.pop();
    values.push(date);
   }

   const newDoctorHolidays = await db.query(
    `INSERT INTO public."Doctor_Holidays"(doctor_id,date) VALUES${rows.join(',')} 
        ON CONFLICT DO NOTHING
        RETURNING *`,
    values
   );

   res.json({
    success: true,
    msg: `Doctor Holiday${1 === newDoctorHolidays.rows.length ? '' : 's'} created successfully${
     0 === newDoctorHolidays.rows.length ? ' [duplicae]' : ''
    }.`,
    data: newDoctorHolidays.rows.reverse(),
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
