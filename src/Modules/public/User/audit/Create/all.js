module.exports = route => app => {
 // Create User
 const rowMode = 'array';
 const getScalar = ({ rows }) => (0 < rows.length ? parseInt(rows[0][0], 10) : 0);

 app.post(route, async (req, res) => {
  let client = null;
  let begun = false;
  try {
   const {
    db,
    isEString,
    isPositiveInteger,
    env: { EVENT, TELLER },
   } = res.locals.utils;

   const { user_id } = res.locals;

   const { email } = req.body;
   if (!isEString(email)) return res.status(400).json({ success: false, msg: 'email can only be a string or empty' });

   client = await db.connect();
   client.query('BEGIN').then(() => (begun = true));

   req.body.teller = await client.query({ text: TELLER.QUERY, rowMode }).then(getScalar);

   if (!isPositiveInteger(req.body.teller)) throw Error('Error occured while auditing.');
   await client.query(`INSERT INTO story."Events"(${EVENT.COLUMNS}) SELECT ${EVENT.ENC}`, [
    req.body.teller,
    user_id,
    EVENT.TYPE.INSERT,
   ]);

   if (0 < email.length) {
    const { rows: users } = await db.query('SELECT id FROM public."Users" WHERE 1=1 AND email = $1', [email]);

    if (0 === users.length) {
     // Email is unique do insert

     const fields = Object.keys(req.body);
     const values = Object.values(req.body);
     const enc_values = values.map((_, i) => `$${++i}`);

     const { rows } = await client.query(
      `INSERT INTO public."Users"(${fields}) VALUES(${enc_values}) RETURNING *`,
      values
     );
     await client.query('COMMIT').then(() => (begun = false));

     return res.json({ success: true, msg: 'User was created successfully.', data: rows });
    }
    // Email is not unique and/or it may be used.
    const [{ id: user_id }] = users;

    const { rows: notuniqueuser } = await db.query(
     `SELECT id, 'Patient' AS type
       FROM public."Patients"
       WHERE user_id = $1
      UNION ALL
      SELECT id, CASE 
                  WHEN is_therapist THEN 'Therapist'
                  ELSE 'Doctor'
                 END
      FROM public."Doctors"
      WHERE user_id = $1`.replace(/\s+/g, ' '),
     [user_id]
    );
    res.json({
     success: false,
     msg: `email is not unique and user_id={${user_id}} ${
      0 < notuniqueuser.length ? `used as a ${notuniqueuser.type}` : ''
     })`,
    });
   }
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
