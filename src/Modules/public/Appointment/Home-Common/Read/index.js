module.exports = route => app => {
 // Read Appoinment[s]
 app.get(route, async (req, res) => {
  try {
   const { db, SQLfeatures, getLimitClause, ROLES, orderBy } = res.locals.utils;
   const { role_id, doctor_id, therapist_id } = res.locals;

   const { limit, offset, ...ids } = req.query;

   if (role_id === ROLES.DOCTOR) ids.doctor_id = doctor_id;
   else if (role_id === ROLES.THERAPIST) ids.doctor_id = therapist_id;

   const { filters, values } = SQLfeatures.IDFilters(ids);

   const { rows } = await db.query(
    `SELECT * FROM public."Appointments" WHERE  ${filters} ${orderBy('id')} ${getLimitClause(limit)}`,
    values
   );

   res.json({
    success: true,
    no_of_records: rows.length,
    msg: `Appointment${1 === rows.length ? ' was' : 's were'} retrieved successfully.`,
    data: rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
