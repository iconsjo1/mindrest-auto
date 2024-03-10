module.exports = route => app => {
 // Read Doctor Holiday[s]
 app.get(route, async (req, res) => {
  try {
   const { db, isPositiveInteger, orderBy, getLimitClause } = res.locals.utils;

   const { doctor_id: id, limit = -1 } = req.query;

   const { rows } = isPositiveInteger(id)
    ? await db.query('SELECT * FROM public."Doctor_Holidays" WHERE 1=1 AND doctor_id=$1 ' + orderBy('id'), [id])
    : await db.query(`SELECT * FROM public."Doctor_Holidays" ${orderBy('id')} ${getLimitClause(limit)}`);

   res.json({
    success: true,
    no_of_records: rows.length,
    msg: `Doctor holiday${1 === rows.length ? ' was' : 's were'} retrieved successfully.`,
    data: rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
