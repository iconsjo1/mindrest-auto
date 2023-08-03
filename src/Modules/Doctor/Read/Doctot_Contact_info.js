module.exports = route => app => {
 // Read Doctor Contact Information[s]

 app.get(route, async (req, res) => {
  try {
   const { doctor_id: id, therapist, limit } = req.query;

   const {
    locals: {
     utils: { db, isPositiveInteger, getLimitClause, ROLES, isTherapist },
     role_id,
     doctor_id,
     therapist_id,
    },
   } = res;
   //doctor_id
   const clause = [ROLES.DOCTOR, ROLES.THERAPIST].includes(role_id)
    ? 'id=' + doctor_id ?? 'id= ' + therapist_id
    : '1=1';

   const { condition, msg } = isTherapist(therapist);

   const { rows } = isPositiveInteger(id)
    ? await db.query(
       `SELECT * FROM public."V_Doctor_Contact_Info" WHERE 1=1 AND doctor_id=$1 AND ${condition} AND ${clause}`,
       [id]
      )
    : await db.query(
       `SELECT * FROM public."V_Doctor_Contact_Info" WHERE ${condition} AND ${clause}${getLimitClause(
        limit
       )}`
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
