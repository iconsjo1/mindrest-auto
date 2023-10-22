module.exports = route => app => {
 // Create Patient [ALL DATA]
 app.post(route, async (req, res) => {
  let client = null;

  const SAVEPOINT = 'fresh';
  try {
   const dispData = {};

   const { db, isValidObject, isPositiveInteger, isPositiveNumber } = res.locals.utils;
   const { user, contact, patient, emergency_contact, service_discounts = [] } = req.body;
   if (
    !(
     isValidObject(user) ||
     isValidObject(contact) ||
     isValidObject(patient) ||
     isValidObject(emergency_contact) ||
     (Array.isArray(service_discounts) &&
      (0 === service_discounts.length ||
       service_discounts.every(
        sd => isValidObject(sd) && isPositiveInteger(sd.service_id) && isPositiveNumber(sd.discount)
       )))
    )
   )
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
   const getRows = oneRow => (false === oneRow ? ({ rows }) => rows[0] : ({ rows }) => rows);

   client = await db.connect();
   await client.query('BEGIN;SAVEPOINT ' + SAVEPOINT);

   const [userSQL, userValues] = dbSQLInsert(user, 'Users');
   dispData.user = await client.query(userSQL, userValues).then(getRows(false));

   const [contactSQL, contactValues] = dbSQLInsert(
    { ...contact, user_id: dispData.user.id },
    'Contacts'
   );
   dispData.contact = await client.query(contactSQL, contactValues).then(getRows(false));

   const [patientSQL, patientValues] = dbSQLInsert(
    { ...patient, user_id: dispData.user.id },
    'Patients'
   );
   dispData.patient = await client.query(patientSQL, patientValues).then(getRows(false));

   const { id: patient_id } = dispData.patient;

   const [econtactSQL, econtactValues] = dbSQLInsert(
    { ...emergency_contact, patient_id },
    'Emergency_Contacts'
   );
   dispData.emergency_contact = await client
    .query(econtactSQL, econtactValues)
    .then(getRows(false));

   if (0 === service_discounts.length) dispData.service_discounts = service_discounts;
   else {
    const fields = ['patient_id', 'service_id', 'discount'];
    const values = [patient_id];
    const enc_values = ['$1'];

    const rows = [];
    let currentIndex = enc_values.length;

    for (const sd of service_discounts) {
     rows.push(`(${enc_values},${Array.from({ length: 2 }, _ => `$${++currentIndex}`)})`);
     values.push(sd.service_id, sd.discount);
    }

    dispData.service_discounts = await client
     .query(
      `INSERT INTO public."Patient_Service_Discounts"(${fields}) VALUES${rows} RETURNING *`,
      values
     )
     .then(getRows(true));

    dispData.service_discounts.sort((a, b) => parseInt(b.id, 10) - parseInt(a.id, 10));
   }
   await client.query('COMMIT;');
   client.release();

   res.json({ success: true, msg: 'New patient was created successfully.', data: dispData });
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
