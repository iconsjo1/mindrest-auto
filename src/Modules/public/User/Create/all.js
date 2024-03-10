module.exports = route => app => {
 // Create User
 app.post(route, async (req, res) => {
  try {
   const { db, isEString } = res.locals.utils;

   const { email } = req.body;
   if (!isEString(email)) return res.status(400).json({ success: false, msg: 'email can only be a string or empty' });

   if (0 < email.length) {
    const { rows: users } = await db.query('SELECT id FROM public."Users" WHERE 1=1 AND email = $1', [email]);

    if (0 === users.length) {
     // Email is unique do insert

     const fields = Object.keys(req.body);
     const values = Object.values(req.body);
     const enc_values = [];

     for (let i = 0; i < values.length; enc_values.push(`$${++i}`));

     const { rows } = await db.query(`INSERT INTO public."Users"(${fields}) VALUES(${enc_values}) RETURNING *`, values);

     return res.json({ success: true, msg: 'User was created successfully.', data: rows });
    }
    // Email is not unique and/or it may be used.
    const { id: user_id } = users[0];

    const { rows: notuniqueuser } = await db.query(
     `SELECT id,
             'Paitient'
            FROM public."Patients" 
           WHERE user_id = $1
        UNION
        SELECT id,
               'Doctor'
              FROM public."Doctors"
             WHERE user_id =$1 AND FALSE = is_therapist
        UNION
        SELECT id,
               'Therapist' type
              FROM public."Doctors" 
             WHERE user_id =$1 AND TRUE = is_therapist`.replace(/\s+/g, ' '),
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
  }
 });
};
