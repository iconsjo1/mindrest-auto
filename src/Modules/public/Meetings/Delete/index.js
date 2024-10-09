module.exports = route => app => {
 // Delete Meeting
 app.delete(route, async (req, res) => {
  try {
   const { meeting_columns, doctor_id, therapist_id, role_id } = res.locals;
   const { db, isPositiveInteger, ROLES } = res.locals.utils;

   let requesterClause = '1=1';
   if (ROLES.THERAPIST === role_id) requesterClause += 'requester_id = ' + therapist_id;
   else if (ROLES.DOCTOR === role_id) requesterClause += 'requester_id = ' + doctor_id;

   const { id } = req.query;
   if (!isPositiveInteger(id)) return res.status(404).json({ success: false, msg: 'Meeting was not found.' });

   const { rows } = await db.query(
    `DELETE FROM public."Meetings" WHERE 1=1 AND id = $1 AND ${requesterClause} RETURNING ${meeting_columns}`,
    [id]
   );

   res.json({
    Success: true,
    msg: 'Meeting was deleted successfully.',
    data: rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
