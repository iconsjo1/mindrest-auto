module.exports = async (req, res) => {
 try {
  const { db, isPositiveInteger, getLimitClause, orderBy } = res.locals.utils;

  const { id, limit } = req.query;

  const { rows } = isPositiveInteger(id)
   ? await db.query('SELECT * FROM public."Document_Categories" WHERE 1=1 AND id=$1', [id])
   : await db.query(`SELECT * FROM public."Document_Categories" ${orderBy('id')} ${getLimitClause(limit)}`);

  res.json({
   success: true,
   no_of_records: rows.length,
   msg: `Document categor${1 === rows.length ? 'y was' : 'ies were'} retrieved successfully.`,
   data: rows,
  });
 } catch ({ message }) {
  res.json({ success: false, message });
 }
};
