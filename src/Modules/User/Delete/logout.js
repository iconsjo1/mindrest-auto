module.exports = route => app => {
 // DELETE User [LOGIN]
 app.delete(route, async (req, res) => {
  try {
   const {
    locals: {
     utils: { db, isPositiveInteger },
     user_columns,
     role_id,
     user_id,
    },
   } = res;

   const { id } = req.query;
   if (!isPositiveInteger(id))
    return res.status(404).json({ Success: false, msg: 'User was not found.' });

   const uid = 5 === role_id ? id : user_id;

   const { rows } = await db.query(
    'UPDATE public."Users" SET jwt_token = NULL WHERE id=$1 RETURNING ' + user_columns,
    [uid]
   );
   res.json({
    success: true,
    msg: 'User was logged out successfully.',
    data: rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
