module.exports = route => app => {
 // Read Reservation[s]
 app.get(route, async (req, res) => {
  try {
   const { role_id, doctor_id: DBdoctor_id, therapist_id: DBtherapist } = res.locals;
   const { db, SQLfeatures, getLimitClause, ROLES } = res.locals.utils;

   const { id, patient_id, doctor_id, limit } = req.query;

   const qfilters = { id, doctor_id, patient_id };

   if (ROLES.DOCTOR === role_id) qfilters.doctor_id = DBdoctor_id;

   if (ROLES.THERAPIST === role_id) qfilters.doctor_id = DBtherapist;

   const { filters, values } = SQLfeatures.IDFilters(qfilters);

   const { rows } = await db.query(
    `SELECT * FROM public."V_Reservations" WHERE ${filters} ${getLimitClause(limit)}`,
    values
   );

   res.json({
    success: true,
    no_of_records: rows.length,
    msg: `Reservation${1 === rows.length ? ' was' : 's were'} retrieved successfully.`,
    data: rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
