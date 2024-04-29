module.exports = route => app => {
 // Create Appointmrnt
 const rowMode = 'array';
 const getScalar = ({ rows }) => (0 < rows.length ? parseInt(rows[0][0], 10) : 0);

 app.post(route, async (req, res) => {
  let client = null;
  let begun = false;

  try {
   const {
    db,
    isPositiveInteger,
    env: { EVENT, TELLER },
   } = res.locals.utils;

   const { user_id } = res.locals;
   const fields = Object.keys(req.body);
   const values = Object.values(req.body);
   const enc_values = values.map((_, i) => `$${i + 1}`);

   client = await db.connect();
   await client.query('BEGIN').then(() => (begun = true));

   const appointmentID = await client
    .query({ text: `INSERT INTO public."Appointments"(${fields}) VALUES(${enc_values}) RETURNING id`, values, rowMode })
    .then(getScalar);

   const teller = await client.query({ text: TELLER.QUERY, rowMode }).then(getScalar);

   if (!isPositiveInteger(teller)) throw Error('Error occured while auditing.');

   await client.query(`INSERT INTO story."Events"(${EVENT.COLUMNS}) SELECT ${EVENT.ENC}`, [
    teller,
    user_id,
    EVENT.TYPE.INSERT,
   ]);

   const { rows: appointment } = await client.query(
    'UPDATE public."Appointments" SET teller = $1 WHERE id = $2 RETURNING *',
    [teller, appointmentID]
   );

   await client.query('COMMIT').then(() => (begun = false));
   res.json({ success: true, msg: 'Appointmrnt was created successfully.', data: appointment });
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
