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
     therapist_id,
    },
   } = res;

   const { condition, msg } = isTherapist(therapist);

   const clause = (r => {
    switch (r) {
     case ROLES.DOCTOR:
      return 'id= ' + doctor_id;
     case ROLES.THERAPIST:
      return 'id= ' + therapist_id;
     default:
      return '1=1';
    }
   })(role_id);

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
