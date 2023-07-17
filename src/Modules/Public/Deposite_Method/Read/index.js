module.exports = route => (app, db) => {
 // Read Deposite Method[s]
 app.get(route, async (req, res) => {
  try {
   const { db } = res.locals.utils;

   const { id } = req.query;

   const depositeMethods = id
    ? await db.query('SELECT * FROM public."Deposite_Methods" WHERE 1=1 AND id=$1', [id])
    : await db.query('SELECT * FROM public."Deposite_Methods"');

   res.json({
    success: true,
    msg: `Deposite method${1 === depositeMethods.rows.length ? '' : 's'} retrieved successfully.`,
    data: depositeMethods.rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
