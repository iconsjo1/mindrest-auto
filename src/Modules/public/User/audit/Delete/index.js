module.exports = route => app => {
 // DELETE User [LOGOUT]
 app.delete(route, async (req, res) => {
  let client = null;
  let begun = false;
  try {
   const {
    db,
    isPositiveInteger,
    ROLES,
    env: { EVENT },
   } = res.locals.utils;

   const { user_columns, role_id, user_id } = res.locals;

   const { id } = req.query;
   if (!isPositiveInteger(id)) return res.status(404).json({ Success: false, msg: 'User was not found.' });

   const uid = ROLES.ADMINISTRATION === role_id ? id : user_id;

   client = await db.connect();
   await client.query('BEGIN').then(() => (begun = true));

   const { rows } = await client.query(
    'UPDATE public."Users" SET jwt_token = NULL WHERE id=$1 RETURNING teller, ' + user_columns,
    [uid]
   );

   if (0 < rows.length) {
    const [{ teller, id: user_id }] = rows;

    if (isPositiveInteger(teller))
     await client.query(`INSERT INTO story."Events"(${EVENT.COLUMNS}) SELECT ${EVENT.ENC}`, [
      teller,
      user_id,
      EVENT.TYPE.LOGOUT,
     ]);
   }
   await client.query('COMMIT').then(() => (begun = false));
   res.json({
    success: true,
    msg: 'User was logged out successfully.',
    data: rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  } finally {
   if (null != client) {
    if (true === begun) {
     try {
      await client.query('ROLLBACK');
     } catch ({ message: rmessage }) {
      throw Error(rmessage);
     }
    }
    client.release();
   }
  }
 });
};
