module.exports = route => app => {
 // Read Meeting[s]
 app.get(route, async (req, res) => {
  try {
   const { limit = -1, ...ids } = req.query;

   const { db, getLimitClause, SQLfeatures, ROLES } = res.locals.utils;

   const { role_id, user_id } = res.locals;

   //    if (ROLES.DOCTOR === role_id) ids.user_id = user_id;
   //    if (ROLES.THERAPIST === role_id) ids.user_id = user_id;

   const { filters, values } = SQLfeatures.IDFilters(ids);
   console.log(`SELECT * FROM public."V_Meetings" WHERE ${filters} ${getLimitClause(limit)}`);
   const { rows } = await db.query(
    `SELECT * FROM public."V_Meetings" WHERE ${filters} ${getLimitClause(limit)}`,
    values
   );
   const display = rows.map(item => ({
    ...item,
    show: ROLES.DOCTOR === role_id || ROLES.THERAPIST === role_id ? item.user_id == user_id : true,
   }));

   res.json({
    success: true,
    no_of_records: display.length,
    msg: `Meeting${1 === display.length ? ' was' : 's were'} retrieved successfully.`,
    data: display,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
