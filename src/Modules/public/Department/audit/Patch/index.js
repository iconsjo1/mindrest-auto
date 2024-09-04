module.exports = route => app => {
 // Patch Department [IS_DELETED]
 app.patch(route, async (req, res) => {
  let client = null;
  let begun = false;
  try {
   const {
    isPositiveInteger,
    db,
    env: { EVENT },
   } = res.locals.utils;
   const { user_id } = res.locals;

   const { id } = req.query;
   if (!isPositiveInteger(id)) return res.status(404).json({ success: false, msg: 'Emergency contact was not found.' });

   client = await db.connect();
   await client.query('BEGIN').then(() => (begun = true));

   const { rows } = await client.query(
    'UPDATE public."Departments" SET is_deleted = true WHERE 1=1 AND id = $1 RETURNING *',
    [id]
   );

   if (0 < rows.length && null != rows[0].teller)
    await client.query(`INSERT INTO story."Events"(${EVENT.COLUMNS}) SELECT ${EVENT.ENC}`, [
     rows[0].teller,
     user_id,
     EVENT.TYPE.DELETE,
    ]);

   await client.query('COMMIT').then(() => (begun = false));
   res.json({
    Success: true,
    msg: 'Department was marked deleted successfully.',
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
