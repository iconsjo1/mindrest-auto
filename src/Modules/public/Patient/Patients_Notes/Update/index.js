module.exports = route => app => {
 // Update Patients_Notes
 app.put(route, async (req, res) => {
  try {
   const {
    locals: {
     utils: { db, isPositiveInteger },
     user_id,
    },
   } = res;
   req.body.modify_by = user_id;
   const { id } = req.query;

   if (!isPositiveInteger(id)) return res.status(404).json({ Success: false, msg: 'Patients note was not found.' });

   const changed = [];
   let i = 1;
   for (let prop in req.body) changed.push(`${prop} = $${i++}`);

   const { rows } = await db.query(`UPDATE public."Patients_Notes" SET ${changed} WHERE 1=1 AND id=$${i} RETURNING *`, [
    ...Object.values(req.body),
    id,
   ]);
   res.json({
    success: true,
    msg: 'Patients note was updated successfully.',
    data: rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
