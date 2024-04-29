module.exports = route => app => {
 // Create Patient [ALL DATA]
 const rowMode = 'array';
 app.post(route, async (req, res) => {
  let client = null;
  let begun = false;
  let nextTeller = null;
  try {
   const { user_id: DBuserId } = res.locals;
   const {
    db,
    isValidObject,
    SQLfeatures,
    isPositiveInteger,
    isEObjArray,
    env: { EVENT, TELLER },
   } = res.locals.utils;

   const { user, contact, patient, emergency_contact, service_discounts = [] } = req.body;
   const dispData = {};

   const TABLES = {
    USERS: 'Users',
    CONTACTS: 'Contacts',
    PATIENTS: 'Patients',
    ECONTACTS: 'Emergency_Contacts',
   };

   const getTeller = async client => {
    const teller = await client.query({ text: TELLER.QUERY, rowMode }).then(({ rows }) => rows[0][0]);

    if (!isPositiveInteger(teller)) throw Error('Error occured while auditing.');
    await client.query(`INSERT INTO story."Events"(${EVENT.COLUMNS}) SELECT ${EVENT.ENC}`, [
     teller,
     DBuserId,
     EVENT.TYPE.INSERT,
    ]);

    return teller;
   };

   const dbSQLInsert = (data, tableName) => {
    const fields = Object.keys(data);
    const values = Object.values(data);
    const enc_values = values.map((_, i) => `$${++i}`);
    return [`INSERT INTO public."${tableName}"(${fields}) VALUES(${enc_values}) RETURNING id`, values];
   };
   const dbSQLUpdate = (pk, teller, tableName) => [
    `UPDATE public."${tableName}" SET teller = $1 WHERE id = $2 RETURNING *`,
    [teller, pk],
   ];
   const getRows = oneRow => (false === oneRow ? ({ rows }) => rows[0] : ({ rows }) => rows);
   const getRowId = ({ rows }) => rows[0][0];
   if (
    !(
     isValidObject(user) &&
     isValidObject(contact) &&
     (null == patient || isValidObject(patient)) &&
     isValidObject(emergency_contact) &&
     isEObjArray(service_discounts, sd => {
      const { isValidObject, isPositiveInteger, isPositiveNumber, isBool } = res.locals.utils;

      return (
       isValidObject(sd) &&
       isPositiveInteger(sd.service_id) &&
       isPositiveNumber(sd.discount) &&
       (null == sd.is_percentag || isBool(sd.is_percentage))
      );
     })
    )
   )
    throw Error('Incorrect submittion of data.');

   client = await db.connect();
   await client.query('BEGIN').then(() => (begun = true));

   //#region "User"
   const [userInsert, userValues] = dbSQLInsert(user, TABLES.USERS);
   const user_id = await client.query({ text: userInsert, values: userValues, rowMode }).then(getRowId);

   nextTeller = await getTeller(client);

   const [userSQL, userTellerValues] = dbSQLUpdate(user_id, nextTeller, TABLES.USERS);
   dispData.user = await client.query(userSQL, userTellerValues).then(getRows(false));
   //#endregion

   //#region "Contacts"
   const [contactInsert, contactValues] = dbSQLInsert({ ...contact, user_id }, TABLES.CONTACTS);
   const contact_id = await client.query({ text: contactInsert, values: contactValues, rowMode }).then(getRowId);

   nextTeller = await getTeller(client);

   const [contactSQL, contactTellerValues] = dbSQLUpdate(contact_id, nextTeller, TABLES.CONTACTS);
   dispData.contact = await client.query(contactSQL, contactTellerValues).then(getRows(false));

   //#endregion

   //#region "Patients"

   const [patientInsert, patientValues] = dbSQLInsert({ ...patient, user_id }, TABLES.PATIENTS);

   const patient_id = await client.query({ text: patientInsert, values: patientValues, rowMode }).then(getRowId);

   nextTeller = await getTeller(client);

   const [patientSQL, patientTellerValues] = dbSQLUpdate(patient_id, nextTeller, TABLES.PATIENTS);
   dispData.patient = await client.query(patientSQL, patientTellerValues).then(getRows(false));

   //#endregion

   //#region "Emergency Contacts"

   const [econtactInsert, econtactValues] = dbSQLInsert({ ...emergency_contact, patient_id }, TABLES.ECONTACTS);
   const emergency_id = await client.query({ text: econtactInsert, values: econtactValues, rowMode }).then(getRowId);

   nextTeller = await getTeller(client);

   const [eContactSQL, eContactTellerValues] = dbSQLUpdate(emergency_id, nextTeller, TABLES.ECONTACTS);
   dispData.emergency_contact = await client.query(eContactSQL, eContactTellerValues).then(getRows(false));

   //#endregion

   if (0 === service_discounts.length) dispData.service_discounts = service_discounts;
   else {
    const { fields, rows, values } = SQLfeatures.bulkInsert(
     service_discounts.map(sd => ({ ...sd, is_percentage: sd.is_percentage ?? '%DEFAULT%' })),
     { patient_id }
    );

    dispData.service_discounts = await client
     .query(`INSERT INTO public."Patient_Service_Discounts"(${fields}) VALUES${rows} RETURNING *`, values)
     .then(getRows(true));

    dispData.service_discounts.sort((a, b) => parseInt(b.id, 10) - parseInt(a.id, 10));
   }
   await client.query('COMMIT').then(() => (begun = false));

   res.json({ success: true, msg: 'New patient was created successfully.', data: dispData });
  } catch ({ message }) {
   res.json({ success: false, message });
  } finally {
   if (null != client) {
    if (true === begun) {
     try {
      await client.query('ROLLBACK');
     } catch ({ message }) {
      throw Error(message);
     }
    }
    client.release();
   }
  }
 });
};
