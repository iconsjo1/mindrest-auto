module.exports = route => app => {
 // Read Log[s]
 app.get(route, async (req, res) => {
  try {
   const { db, isString, isPositiveInteger, getLimitClause } = res.locals.utils;

   const { limit, offset, table, pk } = req.query;

   const filters = {};
   if (isString(table)) filters.log = table;
   if (isPositiveInteger(pk)) filters.primary_id = pk;

   const conditionSet = ['1=1'];
   const valueSet = [];

   for (let i = 0, keys = Object.keys(filters); i < keys.length; ) {
    const k = keys[i];
    conditionSet.push(`${k} = $${++i}`);
    valueSet.push(filters[k]);
   }

   const { rows } = await db.query(
    `SELECT * FROM story."V_Audit_Logs" WHERE ${conditionSet.join(' AND ')} ${getLimitClause(limit, offset)}`,
    valueSet
   );

   res.json({
    success: true,
    no_of_records: rows.length,
    msg: `Log${1 === rows.length ? ' was' : 's were'} retrieved successfully.`,
    data: rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
