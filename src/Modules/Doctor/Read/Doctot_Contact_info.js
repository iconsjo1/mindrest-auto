module.exports = route => app => {
 // Read Doctor Contact Information[s]

 app.get(route, async (req, res) => {
  try {
   const { doctor_id: id, therapist, limit } = req.query;

   const { db, isPositiveInteger, getLimitClause, isTherapist } = res.locals.utils;

   const { condition, msg } = isTherapist(therapist);

   const { rows } = isPositiveInteger(id)
    ? await db.query(
       `SELECT * FROM public."V_Doctor_Contact_Info" WHERE 1=1 AND doctor_id=$1 AND ${condition}`,
       [id]
      )
    : await db.query(
       `SELECT * FROM public."V_Doctor_Contact_Info" WHERE ${condition} ${getLimitClause(limit)}`
      );

   res.json({
    success: true,
    no_of_records: rows.length,
    msg: `${msg}Doctor contact information${
     1 === rows.length ? ' was' : 's were'
    } retrieved successfully.`,
    data: rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
