module.exports = route => app => {
 // Read Doctor[s]

 app.get(route, async (req, res) => {
  try {
   const { id, therapist, limit } = req.query;

   const { db, isPositiveInteger, orderBy, getLimitClause, isTherapist } = res.locals.utils;

   const { condition, msg } = isTherapist(therapist);

   const { rows } = isPositiveInteger(id)
    ? await db.query(`SELECT * FROM public."Doctors" WHERE 1=1 AND id=$1 AND ${condition}`, [id])
    : await db.query(
       `SELECT * 
              FROM public."Doctors" 
             WHERE ${condition} 
        ${orderBy('id')}
        ${getLimitClause(limit)}`.replace(/\s+/g, ' ')
      );

   res.json({
    success: true,
    no_of_records: rows.length,
    msg: `${msg}Doctor${1 === rows.length ? ' was' : 's were'} retrieved successfully.`,
    data: rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
