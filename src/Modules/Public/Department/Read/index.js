module.exports = (app, db) => {
 // Read Department[s]
 app.get('/REST/departments', async (req, res) => {
  try {
   const { id, limit } = req.query;
   const { orderBy, getLimitClause, isPositiveInteger } = res.locals.utils;

   const { rows } = isPositiveInteger(id)
    ? await db.query('SELECT * FROM public."Departments" WHERE 1=1 AND id=$1', [id])
    : await db.query(
       `SELECT * FROM public."Departments" ${orderBy('id')} ${getLimitClause(limit)}`
      );

   res.json({
    success: true,
    no_of_records: rows.length,
    msg: `Department${1 === rows.length ? ' was' : 's were'} retrieved successfully.`,
    data: rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
