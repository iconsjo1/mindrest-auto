module.exports = route => app => {
 // Create login
 app.post(route, async (req, res) => {
  const { db, isString } = res.locals.utils;
  try {
   const { email, password } = req.body;
   if (!(isString(email) && isString(password))) throw new Error('Credentials must be strings.');
   const { rows } = await db.query(
    `SELECT * FROM public."Users"
             WHERE 1=1
              AND email = $1
              AND password = $2`.replace(/\s+/g, ' '),
    [email, password]
   );

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
