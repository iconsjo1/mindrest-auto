module.exports = route => app => {
 // Read Doctor Meeting[s]
 app.get(route, async (req, res) => {
  try {
   const { limit = -1, ...ids } = req.query;

   const { db, getLimitClause, SQLfeatures, ROLES } = res.locals.utils;

   const { role_id, doctor_id, therapist_id } = res.locals;

//    if (ROLES.DOCTOR === role_id) ids.doctor_id = doctor_id;
    if (ROLES.THERAPIST === role_id) ids.doctor_id = therapist_id;

   const { filters, values } = SQLfeatures.IDFilters(ids);

   const { rows } = await db.query(
    `SELECT * FROM public."V_Doctor_Meetings" WHERE ${filters} ${getLimitClause(limit)}`,
    values
   );

   res.json({
    success: true,
    no_of_records: rows.length,
    msg: `Doctor meeting${1 === rows.length ? ' was' : 's were'} retrieved successfully.`,
    data: rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
