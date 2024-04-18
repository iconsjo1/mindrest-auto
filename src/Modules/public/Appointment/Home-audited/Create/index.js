module.exports = route => app => {
 // Create Appointmrnt
 app.post(route, async (req, res) => {
  let client = null;
  let begun = false;

  try {
   const { user_id } = res.locals;
   const {
    db,
    isPositiveInteger,
    env: { STORY, TELLER },
   } = res.locals.utils;

   const fields = Object.keys(req.body);
   const values = Object.values(req.body);
   const enc_values = [];

   for (let i = 0; i < values.length; enc_values.push(`$${++i}`));

   client = await db.connect();
   await client.query('BEGIN').then(() => (begun = true));

   const { rows: appointment } = await client.query(
    `INSERT INTO public."Appointments"(${fields}) VALUES(${enc_values}) RETURNING *`,
    values
   );

   const tellerID = await client
    .query({
     text: `INSERT INTO story."Tellers"(${TELLER.COLUMNS}) SELECT ${TELLER.ENC} RETURNING id`,
     values: [user_id, STORY.APPOINTMENT],
     rowMode: 'array',
    })
    .then(({ rows }) => (0 < rows.length ? parseInt(rows[0][0], 10) : 0));

   if (isPositiveInteger(tellerID)) {
    await client.query('UPDATE public."Appointments" SET teller_id = $1 WHERE id = $2', [tellerID, appointment.id]);
    appointment[0].teller_id = tellerID;
   }

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
