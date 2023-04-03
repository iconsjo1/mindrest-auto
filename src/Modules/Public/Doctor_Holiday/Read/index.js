module.exports = route => (app, db) => {
 // Read Prescription Medicine[s]
 app.get(route, async (req, res) => {
  try {
   const { doctor_id: id } = req.query;

   const doctorHolidays = id
    ? await db.query('SELECT * FROM public."Doctor_Holidays" WHERE 1=1 AND doctor_id=$1 ', [id])
    : await db.query('SELECT * FROM public."Doctor_Holidays"');

   res.json({
    success: true,
    msg: `Doctor holiday${1 === doctorHolidays.rows.length ? '' : 's'} retrieved successfully.`,
    data: doctorHolidays.rows.reverse(),
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
