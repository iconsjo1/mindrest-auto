module.exports = route => app => {
 // Read Admin_Todo[s]
 app.get(route, async (req, res) => {
  try {
   const { db, isPositiveInteger, getLimitClause } = res.locals.utils;
   const { id, user_id, limit } = req.query;

   const { rows } = isPositiveInteger(id)
    ? await db.query('SELECT * FROM public."Admin_Todos" WHERE 1=1 AND id=$1', [id])
    : isPositiveInteger(user_id)
      ? await db.query('SELECT * FROM public."Admin_Todos" WHERE 1=1 AND user_id=$1', [user_id])
      : await db.query(`SELECT * FROM public."Admin_Todos" ${getLimitClause(limit)}`);

   res.json({
    success: true,
    no_of_records: rows.length,
    msg: `Admin todo${1 === rows.length ? ' was' : 's were'} retrieved successfully.`,
    data: rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
