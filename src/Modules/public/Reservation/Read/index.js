module.exports = route => app => {
 // Read Reservation[s]
 app.get(route, async (req, res) => {
  try {
   const { role_id, doctor_id: DBdoctor_id } = res.locals;
   const { db, isPositiveInteger, orderBy, getLimitClause, ROLES } = res.locals.utils;

   const { id, patient_id, doctor_id, limit } = req.query;
   const filters = { id, doctor_id, patient_id };

   if (ROLES.DOCTOR === role_id) filters['doctor_id'] = DBdoctor_id;

   const conditionSet = ['1=1'];
   const valueSet = [];

   for (let i = 0, sanitizingIndex = 0, keys = Object.keys(filters); i < keys.length; i++) {
    const k = keys[i];
    const v = filters[k];
    if (isPositiveInteger(v)) {
     conditionSet.push(`${k} = $${++sanitizingIndex}`);
     valueSet.push(v);
    }
   }
   const { rows } = await db.query(
    `SELECT * FROM public."V_Reservations" WHERE ${conditionSet.join(' AND ')} ${orderBy('id')} ${getLimitClause(limit)}`,
    valueSet
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
