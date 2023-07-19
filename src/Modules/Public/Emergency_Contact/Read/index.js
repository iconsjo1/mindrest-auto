module.exports = route => app => {
 // Read Emergency Contact[s]

 app.get(route, async (req, res) => {
  try {
   const { db, isPositiveInteger, orderBy, getLimitClause } = res.locals.utils;

   const { id, limit } = req.query;

   const emergencyContacts = isPositiveInteger(id)
    ? await db.query('SELECT * FROM public."Emergency_Contacts" WHERE 1=1 AND id=$1', [id])
    : await db.query(
       `SELECT * FROM public."Emergency_Contacts" ${orderBy('id')} ${getLimitClause(limit)}`
      );

   res.json({
    success: true,
    no_of_records: rows.length,
    msg: `Emergency contact${1 === rows.length ? ' was' : 's were'} retrieved successfully.`,
    data: emergencyContacts.rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
