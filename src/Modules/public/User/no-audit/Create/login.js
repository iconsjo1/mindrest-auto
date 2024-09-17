const jwt = require('jsonwebtoken');

module.exports = route => app => {
 // Create User [LOGIN]
 app.post(route, async (req, res) => {
  let client = null;
  let begun = false;
  const {
   db,
   isString,
   isPositiveInteger,
   env: { TELLER, EVENT },
  } = res.locals.utils;

  const { user_columns } = res.locals;

  try {
   const { email, password } = req.body;

   if (!(isString(email) && isString(password)))
    return res.status(400).json({ success: false, msg: 'Credentials must be strings.' });

   const { rows: signedIn } = await db.query(
    `SELECT ${user_columns}, teller FROM public."Users" WHERE 1=1 AND LOWER(email) = LOWER($1) AND password = $2 AND is_deleted =false`,
    [email, password]
   );

   if (0 === signedIn.length) throw Error('User email={' + email + '} WITH password does not exist.');

   const [{ id: user_id, user_name, teller }] = signedIn;
   const token = jwt.sign({ user_id, user_name }, 'jwt-MIND-2023', {
    expiresIn: '2d',
   });

   client = await db.connect();
   await client.query('BEGIN').then(() => (begun = true));

   const tellerValues = [teller, user_id, EVENT.TYPE.LOGIN];

   if (!isPositiveInteger(teller))
    tellerValues[0] = await client.query({ text: TELLER.QUERY, rowMode: 'array' }).then(({ rows }) => rows[0][0]);

   const { rows } = await client.query(
    'UPDATE public."Users" SET jwt_token = $1, teller = $2 WHERE id = $3 RETURNING ' + user_columns,
    [token, tellerValues[0], user_id]
   );
   await client.query(`INSERT INTO story."Events"(${EVENT.COLUMNS}) SELECT ${EVENT.ENC}`, tellerValues);

   await client.query('COMMIT').then(() => (begun = false));

   res.json(
    0 < rows.length
     ? {
        success: true,
        msg: `User logged in successfully.`,
        data: rows,
       }
     : {
        success: false,
        msg: 'useraname and/or password does not match.',
       }
   );
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
