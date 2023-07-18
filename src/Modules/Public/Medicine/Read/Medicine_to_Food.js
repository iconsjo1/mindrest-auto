module.exports = route => (app, db) => {
 // Read Medicine[s]
 app.get(route, async (req, res) => {
  try {
   const { db, isPositiveInteger, orderBy, getLimitClause } = res.locals.utils;

   const { id, limit } = req.query;

   const { rows } = isPositiveInteger(id)
    ? await db.query(
       `SELECT id, CONCAT(time_desc,' ',food) food_relation FROM public."Medicine_to_Foods" WHERE 1=1 AND id=$1`,
       [id]
      )
    : await db.query(
       `SELECT id,CONCAT(time_desc,' ',food) food_relation FROM public."Medicine_to_Foods" ${orderBy(
        'id'
       )} ${getLimitClause(limit)}`
      );

   res.json({
    success: true,
    no_of_records: rows.length,
    msg: `Medicine to food${1 === rows.length ? ' was' : 's were'} retrieved successfully.`,
    data: rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
