module.exports = route => (app, db) => {
 // Read Expense[s]
 app.get(route, async (req, res) => {
  try {
   const { db, isPositiveInteger, getLimitClause, orderBy } = res.locals.utils;
   const { id, limit } = req.query;

   const { rows } = isPositiveInteger(id)
    ? await db.query('SELECT * FROM public."V_Expenses" WHERE 1=1 AND id=$1', [id])
    : await db.query(`SELECT * FROM public."V_Expenses" ${orderBy('id')} ${getLimitClause(limit)}`);

   res.json({
    success: true,
    msg: `Expense${1 === rows.length ? '' : 's'} retrieved successfully.`,
    data: rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
