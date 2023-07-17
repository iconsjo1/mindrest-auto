module.exports = route => (app, db) => {
 // Read Holiday[s]
 app.get(route, async (req, res) => {
  try {
   const { db } = res.locals.utils;

   const holidays = await db.query('SELECT * FROM public."Holidays"');

   res.json({
    success: true,
    msg: `Holiday${1 === holidays.rows.length ? '' : 's'} retrieved successfully.`,
    data: holidays.rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
