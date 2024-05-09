module.exports = route => app => {
 // Create Emergency Contact

 app.post(route, async (req, res) => {
  let client = null;
  let begun = false;
  try {
   const { user_id } = res.locals;
   const {
    db,
    isPositiveInteger,
    env: { EVENT, TELLER },
   } = res.locals.utils;

   client = await db.connect();
   await client.query('BEGIN').then(() => (begun = true));

   req.body.teller = await client.query({ text: TELLER.QUERY, rowMode: 'array' }).then(({ rows }) => rows[0][0]);

   if (!isPositiveInteger(req.body.teller)) throw Error('Error occured while auditing.');

   await client.query(`INSERT INTO story."Events"(${EVENT.COLUMNS}) SELECT ${EVENT.ENC}`, [
    req.body.teller,
    user_id,
    EVENT.TYPE.INSERT,
   ]);

   const fields = Object.keys(req.body);
   const values = Object.values(req.body);
   const enc_values = values.map((_, i) => `$${++i}`);

   const { rows } = await client.query(
    `INSERT INTO public."Emergency_Contacts"(${fields}) VALUES(${enc_values}) RETURNING *`,
    values
   );

   await client.query('COMMIT').then(() => (begun = false));
   res.json({ success: true, msg: 'Emergency contact was created successfully.', data: rows });
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
