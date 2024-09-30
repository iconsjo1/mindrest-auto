module.exports = route => app => {
 // Read Doctor Patients[s]
 app.get(route, async (req, res) => {
  try {
   const { therapist, limit, ...qfilters } = req.query;

   const { role_id, doctor_id, therapist_id } = res.locals;
   const { db, getLimitClause, ROLES, isTherapist, SQLfeatures } = res.locals.utils;

   //    if (role_id === ROLES.DOCTOR) qfilters.doctor_id = doctor_id;
   if (role_id === ROLES.THERAPIST) qfilters.doctor_id = therapist_id;

   let { filters, values } = SQLfeatures.IDFilters(qfilters);

   const { condition, msg } = isTherapist(therapist);
   filters += ` AND ${condition}`;

   const { rows } = await db.query(
    `SELECT * FROM public."V_Doctor_Patients" WHERE ${filters} ${getLimitClause(limit)}`,
    values
   );

   if (![ROLES.DOCTOR, ROLES.THERAPIST].includes(role_id)) rows.forEach(r => delete r.case_history);

   res.json({
    success: true,
    no_of_records: rows.length,
    msg: `${msg}Doctor patient${1 === rows.length ? ' was' : 's were'} retrieved successfully.`,
    data: rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
