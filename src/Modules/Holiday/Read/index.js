module.exports = route => app => {
 // Read Holiday[s]
 app.get(route, async (req, res) => {
  try {
   const { db, isPositiveInteger, orderBy } = res.locals.utils;
   const { year } = req.query;

   const { rows } = isPositiveInteger(year)
    ? await db.query('SELECT * FROM public."Holidays" WHERE 1=1 AND EXTRACT(YEAR FROM DATE)=$1' + orderBy('date'), [
       year,
      ])
    : await db.query('SELECT * FROM public."Holidays" ' + orderBy('date'));

   res.json({
    success: true,
    msg: `Holiday${1 === rows.length ? ' was' : 's were'} retrieved successfully.`,
    data: rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
