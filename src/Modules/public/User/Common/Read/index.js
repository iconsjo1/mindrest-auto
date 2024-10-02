module.exports = route => app => {
 // Read User[s]
 app.get(route, async (req, res) => {
  try {
   const { db, isPositiveInteger, orderBy, getLimitClause } = res.locals.utils;

   const { id, role_id, limit } = req.query;

   const { rows } = isPositiveInteger(id)
    ? await db.query('SELECT * FROM public."Users" WHERE 1=1 AND id=$1 AND is_deleted =false', [id])
    : isPositiveInteger(role_id)
      ? await db.query(` SELECT * FROM public."Users" WHERE 1=1 AND role_id=$1 AND is_deleted =false`, [role_id])
      : await db.query(
         `SELECT * FROM public."Users" WHERE is_deleted =false ${orderBy('id')} ${getLimitClause(limit)}`
        );

   res.json({
    success: true,
    no_of_records: rows.length,
    msg: `User${1 === rows.length ? ' was' : 's were'} retrieved successfully.`,
    data: rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
