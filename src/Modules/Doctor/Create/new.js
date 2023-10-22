module.exports = route => app => {
 // Create Patient [ALL DATA]
 app.post(route, async (req, res) => {
  let client = null;

  const SAVEPOINT = 'fresh';
  try {
   const dispData = {};

   const { db, isValidObject } = res.locals.utils;
   const { user, contact, doctor } = req.body;
   if (!(isValidObject(user) || isValidObject(contact) || isValidObject(doctor)))
    throw Error('Incorrect submittion of data.');

   const dbSQLInsert = (data, tableName) => {
    const fields = Object.keys(data);
    const values = Object.values(data);
    const enc_values = values.map((_, i) => `$${++i}`);

    return [
     `INSERT INTO public."${tableName}"(${fields}) VALUES(${enc_values}) RETURNING *`,
     values,
    ];
   };
   const getRow = ({ rows }) => rows[0];

   client = await db.connect();
   await client.query('BEGIN;SAVEPOINT ' + SAVEPOINT);

   const [userSQL, userValues] = dbSQLInsert(user, 'Users');
   dispData.user = await client.query(userSQL, userValues).then(getRow);

   const [contactSQL, contactValues] = dbSQLInsert(
    { ...contact, user_id: dispData.user.id },
    'Contacts'
   );
   dispData.contact = await client.query(contactSQL, contactValues).then(getRow);

   const [doctorSQL, doctorValues] = dbSQLInsert(
    { ...doctor, user_id: dispData.user.id },
    'Doctors'
   );
   dispData.doctor = await client.query(doctorSQL, doctorValues).then(getRow);

   await client.query('COMMIT;');
   client.release();

   res.json({ success: true, msg: 'New doctor was created successfully.', data: dispData });
  } catch ({ message }) {
   if (null != client) {
    try {
     await client.query('ROLLBACK TO SAVEPOINT ' + SAVEPOINT);
    } catch ({ message: rollMessage }) {
     message = rollMessage;
    } finally {
     client.release();
    }
   }
   res.json({ success: false, message });
  }
 });
};
