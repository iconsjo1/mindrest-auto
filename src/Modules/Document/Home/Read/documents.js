module.exports = route => app => {
 // Read Documents
 app.get(route, async (_, res) => {
  try {
   const { db } = res.locals.utils;

   const { rows } = await db.query('SELECT * FROM public."Documents"');

   res.json({
    success: true,
    no_of_records: rows.length,
    msg: `Documents${1 === rows.length ? ' was' : 's were'} retrieved successfully.`,
    data: rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
