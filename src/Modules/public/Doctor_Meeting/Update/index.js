module.exports = route => app => {
 // Update Doctor Meeting
 app.put(route, async (req, res) => {
  try {
   const { meeting_columns, doctor_id, therapist_id, role_id } = res.locals;
   const { db, isPositiveInteger, ROLES } = res.locals.utils;

   let requesterClause = '1=1';
   if (ROLES.THERAPIST === role_id) requesterClause += 'requester_id = ' + therapist_id;
   else if (ROLES.DOCTOR === role_id) requesterClause += 'requester_id = ' + doctor_id;

   const { id } = req.query;
   if (!isPositiveInteger(id)) return res.status(404).json({ Success: false, msg: 'Doctor meeting was not found.' });

   const changed = Object.keys(req.body).map((k, i) => `${k} = $${++i}`);

   const { rows } = await db.query(
    `UPDATE public."Doctor_Meetings" SET ${changed} WHERE 1=1 AND id=$${changed.length + 1} AND ${requesterClause} RETURNING ${meeting_columns}`,
    [...Object.values(req.body), id]
   );

   res.json({
    success: true,
    msg: 'Doctor meeting was updated successfully.',
    data: rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
