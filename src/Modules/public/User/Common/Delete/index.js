module.exports = route => app => {
 // Delete User
 app.delete(route, async (req, res) => {
  let client = null;
  let begun = false;
  try {
   const { db, isPositiveInteger } = res.locals.utils;

   const { id } = req.query;
   if (!isPositiveInteger(id)) return res.status(404).json({ success: false, msg: 'User was not found.' });

   client = await db.connect();
   await client.query('BEGIN').then(() => (begun = true));

   const teller = await client
    .query({ text: 'SELECT teller FROM public."Users" WHERE 1=1 AND id = $1', values: [id], rowMode: 'array' })
    .then(({ rows }) => rows[0][0]);

   if (isPositiveInteger(teller)) await client.query('DELETE FROM story."Events" WHERE 1=1 AND teller = $1', [teller]);

   const { rows } = await client.query('DELETE FROM public."Users" WHERE 1=1 AND id = $1 RETURNING *', [id]);

   res.json({ Success: true, msg: 'User was deleted successfully.', data: rows });
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
