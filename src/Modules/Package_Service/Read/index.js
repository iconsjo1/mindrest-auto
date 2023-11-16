module.exports = route => app => {
 // Read Package Service[s]
 app.get(route, async (req, res) => {
  try {
   const { db, isPositiveInteger, getLimitClause } = res.locals.utils;

   const { package_id: id, limit = -1 } = req.query;

   const { rows } = isPositiveInteger(id)
    ? await db.query('SELECT * FROM public."V_Package_Services" WHERE 1=1 AND package_id=$1 ' + getLimitClause(limit), [
       id,
      ])
    : await db.query('SELECT * FROM public."V_Package_Services" ' + getLimitClause(limit));

   res.json({
    success: true,
    no_of_records: rows.length,
    msg: `Package service${1 === rows.length ? ' was' : 's were'} retrieved successfully.`,
    data: rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
