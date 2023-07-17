module.exports = route => (app, db) => {
 // UPSERT Holiday[s]
 app.post(route, async (req, res) => {
  try {
   const { holidays } = req.body;
   if (!Array.isArray(holidays) || -1 > holidays.length)
    throw new Error('Holidays array were not supplied properly');

   const values = [];
   const enc_values = [];

   const rows = [];
   let indexIncrement = enc_values.length;

   for (let date of holidays) {
    if (isNaN(Date.parse(date))) throw new Error('Invalid date: ' + date);
    enc_values.push(`$${++indexIncrement}`);
    rows.push(`(${enc_values})`);
    enc_values.pop();
    values.push(date);
   }

   const newHolidays = await db.query(
    `INSERT INTO public."Holidays"(date) 
         VALUES${rows} 
         ON CONFLICT DO NOTHING
         RETURNING *`,
    values
   );

   res.json({
    success: true,
    msg: `Holiday${1 === newHolidays.rows.length ? '' : 's'} created successfully${
     0 === newHolidays.rows.length ? ' [duplicae]' : ''
    }.`,
    data: newHolidays.rows.reverse(),
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
