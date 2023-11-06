const jwt = require('jsonwebtoken');

module.exports = route => app => {
 // Create User [LOGIN]
 app.post(route, async (req, res) => {
  const {
   locals: {
    utils: { db, isPositiveInteger, isString },
    user_columns,
   },
  } = res;
  try {
   const { email, password } = req.body;

   if (!(isString(email) && isString(password)))
    return res.status(400).json({ success: false, msg: 'Credentials must be strings.' });

   const {
    rows: [signedIn],
   } = await db.query(
    `SELECT ${user_columns} FROM public."Users" WHERE 1=1 AND LOWER(email) = LOWER($1) AND password = $2`,
    [email, password]
   );

   const { id: user_id, user_name } = signedIn;

   if (!isPositiveInteger(user_id))
    return res.status(404).json({
     success: false,
     msg: 'User email={' + email + '} WITH password does not exist.',
    });

   const token = jwt.sign({ user_id, user_name }, 'jwt-MIND-2023', {
    expiresIn: '2d',
   });

   const { rows } = await db.query('UPDATE public."Users" SET jwt_token = $1 WHERE id = $2 RETURNING ' + user_columns, [
    token,
    user_id,
   ]);

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
  }
 });
};
