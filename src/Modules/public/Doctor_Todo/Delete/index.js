module.exports = route => app => {
 // Delete Doctor Todo
 app.delete(route, async (req, res) => {
  try {
   const { todo_columns, ROLES, doctor_id, therapist_id, role_id } = res.locals;
   const { db, isPositiveInteger } = res.locals.utils;

   let doctorClause = '1=1';
   if (ROLES.THERAPIST === role_id) doctorClause += 'AND doctor_id = ' + therapist_id;
   else if (ROLES.DOCTOR === role_id) doctorClause += 'AND doctor_id = ' + doctor_id;

   const { id } = req.query;
   if (!isPositiveInteger(id)) return res.status(404).json({ success: false, msg: 'Doctor todo was not found.' });

   const { rows } = await db.query(
    `DELETE FROM public."Doctor_Todos" WHERE 1=1 AND id = $1 ${doctorClause} RETURNING ${todo_columns}`,
    [id]
   );

   res.json({
    Success: true,
    msg: 'Doctor todo was deleted successfully.',
    data: rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
