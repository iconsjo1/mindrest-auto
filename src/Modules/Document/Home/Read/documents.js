module.exports = route => app => {
 // Read Document[s]
 app.get(route, async (req, res) => {
  const { db, getLimitClause, isPositiveInteger, orderBy, isIterable } = res.locals.utils;

  try {
   const { limit, ids } = req.query;

   const idsArray = isIterable(ids)
    ? Array.from(new Set(ids.split('|').filter(isPositiveInteger)), id => parseInt(id, 10))
    : [];

   const { rows } =
    0 < idsArray.length
     ? await db.query('SELECT * FROM public."Documents" WHERE 1=1 AND id = ANY($1)', [idsArray])
     : await db.query(`SELECT * FROM public."Documents" ${orderBy('id')} ${getLimitClause(limit)}`);

   res.json({
    success: true,
    no_of_records: rows.length,
    message: `Document${1 === rows.length ? ' was' : 's were'} retrieved successfully.`,
    data: rows.map(row => ({ ...row, path: row.document_path + '.' + row.document_extension })),
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
