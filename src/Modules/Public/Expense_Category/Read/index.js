module.exports = route => (app, db) => {
 // Read Expense Categor[y|ies]
 app.get(route, async (req, res) => {
  try {

   const { db,isPositiveInteger,getLimitClause, orderBy } = res.locals.utils;

   const { id, limit } = req.query;

   const { rows } = isPositiveInteger(id)
    ? await db.query('SELECT * FROM public."Expense_Categories" WHERE 1=1 AND id=$1', [id])
    : await db.query(
       `SELECT * FROM public."Expense_Categories" ${orderBy('id')} ${getLimitClause(limit)}`
      );

   res.json({
    success: true,
    msg: `Expense categor${1 === rows.length ? 'y' : 'ies'} retrieved successfully.`,
    data: rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
