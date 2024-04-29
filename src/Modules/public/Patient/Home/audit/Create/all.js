module.exports = route => app => {
 // Create Patient
 const rowMode = 'array';
 const getScalar = ({ rows }) => (0 < rows.length ? parseInt(rows[0][0], 10) : 0);

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

   const fields = Object.keys(req.body);
   const values = Object.values(req.body);
   const enc_values = values.map((_, i) => `$${++i}`);

   client = await db.connect();
   client.query('BEGIN').then(() => (begun = true));

   const teller = await client.query({ text: TELLER.QUERY, rowMode }).then(getScalar);

   if (!isPositiveInteger(teller)) throw Error('Error occured while auditing.');
   await client.query(`INSERT INTO story."Events"(${EVENT.COLUMNS}) SELECT ${EVENT.ENC}`, [
    teller,
    user_id,
    EVENT.TYPE.INSERT,
   ]);

   const patient_id = await client
    .query({
     text: `INSERT INTO public."Patients"(${fields}) VALUES(${enc_values}) RETURNING id`,
     values,
     rowMode,
    })
    .then(getScalar);

   const { rows } = await client.query('UPDATE public."Patients" SET teller = $1 WHERE id = $2', [teller, patient_id]);

   client.query('COMMIT').then(() => (begun = false));
   res.json({ success: true, msg: 'Patient was created successfully.', data: rows });
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
