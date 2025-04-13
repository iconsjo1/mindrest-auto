module.exports = route => app => {
 // Update Doctor Todo
 app.put(route, async (req, res) => {
  try {
   const { todo_columns, doctor_id, therapist_id, role_id } = res.locals;
   const { db, isPositiveInteger, ROLES } = res.locals.utils;

   let doctorClause = '1=1';
   if (ROLES.THERAPIST === role_id) doctorClause += ' AND doctor_id = ' + therapist_id;
   else if (ROLES.DOCTOR === role_id) doctorClause += ' AND doctor_id = ' + doctor_id;

   const { id } = req.query;
   if (!isPositiveInteger(id)) return res.status(404).json({ Success: false, msg: 'Doctor todo was not found.' });

   const changed = Object.keys(req.body).map((k, i) => `"${k}" = $${++i}`);

   const { rows } = await db.query(
    `UPDATE public."Doctor_Todos" SET ${changed} WHERE 1=1 AND id=$${changed.length + 1} AND ${doctorClause} RETURNING ${todo_columns}`,
    [...Object.values(req.body), id]
   );

   res.json({ success: true, msg: 'Doctor todo was updated successfully.', data: rows });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
