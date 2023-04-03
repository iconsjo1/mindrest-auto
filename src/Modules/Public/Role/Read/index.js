module.exports = route => app => {
 // Read Role[s]
 app.get(route, async (req, res) => {
  const { db, isPositiveInteger, getLimitClause, orderBy } = res.locals.utils;
  try {
   const { id, limit = process.env.DB_NO_LIMIT_FLAG } = req.query;

   const { rows } = isPositiveInteger(id)
    ? await db.query('SELECT * FROM public."Roles" WHERE 1=1 AND id=$1', [id])
    : await db.query(`SELECT * FROM public."Roles" ${orderBy('id')} ${getLimitClause(limit)}`);

   res.json({
    success: true,
    no_of_records: rows.length,
    msg: `Role${1 === rows.length ? ' was' : 's were'} retrieved successfully.`,
    data: rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
