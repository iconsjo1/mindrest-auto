module.exports = route => app => {
 // Read Role Screen[s]
 app.get(route, async (req, res) => {
  const { db, isPositiveInteger, getLimitClause } = res.locals.utils;
  try {
   const { id, limit = -1 } = req.query;

   const { rows } = isPositiveInteger(id)
    ? await db.query('SELECT * FROM public."V_Role_Screens" WHERE 1=1 AND id=$1', [id])
    : await db.query(`SELECT * FROM public."V_Role_Screens" ${getLimitClause(limit)}`);

   res.json({
    success: true,
    no_of_records: rows.length,
    msg: `Role screen${1 === rows.length ? ' was' : 's were'} retrieved successfully.`,
    data: rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
