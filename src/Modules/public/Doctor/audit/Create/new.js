module.exports = route => app => {
 // Create Doctor [ALL DATA]
 app.post(route, async (req, res) => {
  let client = null;
  let begun = false;
  try {
   const { user_id } = res.locals;
   const {
    db,
    isValidObject,
    isPositiveInteger,
    env: { EVENT, TELLER },
   } = res.locals.utils;

   const { user, contact, doctor } = req.body;

   if (!isValidObject(user) || !isValidObject(contact) || !isValidObject(doctor))
    throw Error('Incorrect submittion of data.');

   const dispData = {};

   const getTeller = async () => {
    const teller = await client.query({ text: TELLER.QUERY, rowMode: 'array' }).then(({ rows }) => rows[0][0]);

    if (!isPositiveInteger(teller)) throw Error('Error occured while auditing.');
    await client.query(`INSERT INTO story."Events"(${EVENT.COLUMNS}) SELECT ${EVENT.ENC}`, [
     teller,
     user_id,
     EVENT.TYPE.INSERT,
    ]);

    return teller;
   };

   const dbSQLInsert = async (data, tableName) => {
    data.teller = await getTeller();

    const fields = Object.keys(data);
    const values = Object.values(data);
    const enc_values = values.map((_, i) => `$${++i}`);

    return [`INSERT INTO public."${tableName}"(${fields}) VALUES(${enc_values}) RETURNING *`, values];
   };

   const getRows = oneRow => (false === oneRow ? ({ rows }) => rows[0] : ({ rows }) => rows);

   client = await db.connect();
   await client.query('BEGIN').then(() => (begun = true));

   const [userInsert, userValues] = await dbSQLInsert(user, 'Users');
   dispData.user = await client.query(userInsert, userValues).then(getRows(false));

   const [contactInsert, contactValues] = await dbSQLInsert({ ...contact, user_id: dispData.user.id }, 'Contacts');
   dispData.contact = await client.query(contactInsert, contactValues).then(getRows(false));

   const [doctorSQL, doctorValues] = await dbSQLInsert({ ...doctor, user_id: dispData.user.id }, 'Doctors');
   dispData.doctor = await client.query(doctorSQL, doctorValues).then(getRows(false));

   await client.query('COMMIT').then(() => (begun = false));

   res.json({ success: true, msg: 'New doctor was created successfully.', data: dispData });
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
