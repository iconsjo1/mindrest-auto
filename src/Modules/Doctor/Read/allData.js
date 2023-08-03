module.exports = route => app => {
 // Read Doctor[s]

 app.get(route, async (req, res) => {
  try {
   const { id, therapist, limit } = req.query;

   const {
    locals: {
     utils: { db, isPositiveInteger, orderBy, getLimitClause, ROLES, isTherapist },
     role_id,
     doctor_id,
    },
   } = res;

   const { condition, msg } = isTherapist(therapist);

   const clause = [ROLES.DOCTOR, ROLES.THERAPIST].includes(role_id)
    ? 'id=' + id ?? 'id= ' + therapist_id
    : '1=1';

   const { rows } = isPositiveInteger(id)
    ? await db.query(
       `SELECT * FROM public."Doctors" WHERE 1=1 AND id=$1 AND ${condition} AND ${clause}`,
       [id]
      )
    : await db.query(
       `SELECT * 
              FROM public."Doctors" 
             WHERE ${condition} AND ${clause}
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
