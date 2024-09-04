module.exports = route => app => {
 // Create Patient [ALL DATA]
 app.post(route, async (req, res) => {
  let client = null;
  let begun = false;

  try {
   const { user_id } = res.locals;
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

   if (
    !(
     isValidObject(user) &&
     isValidObject(contact) &&
     (null == patient || isValidObject(patient)) &&
     //   isValidObject(emergency_contact)
     isEObjArray(service_discounts, sd => {
      const { isValidObject, isPositiveInteger, isPositiveNumber, isBool } = res.locals.utils;
      return (
       isValidObject(sd) &&
       isPositiveInteger(sd.service_id) &&
       (null == sd.discount || isPositiveNumber(sd.discount)) &&
       (null == sd.is_percentag || isBool(sd.is_percentage))
      );
     })
    )
   )
    throw Error('Incorrect submittion of data.');

   client = await db.connect();
   await client.query('BEGIN').then(() => (begun = true));

   const [userInsert, userValues] = await dbSQLInsert(user, 'Users');
   dispData.user = await client.query(userInsert, userValues).then(getRows(false));

   const [contactInsert, contactValues] = await dbSQLInsert({ ...contact, user_id: dispData.user.id }, 'Contacts');
   dispData.contact = await client.query(contactInsert, contactValues).then(getRows(false));

   const [patientInsert, patientValues] = await dbSQLInsert({ ...patient, user_id: dispData.user.id }, 'Patients');
   dispData.patient = await client.query(patientInsert, patientValues).then(getRows(false));

   //    const [econtactInsert, econtactValues] = await dbSQLInsert(
   //     { ...emergency_contact, patient_id: dispData.patient.id },
   //     'Emergency_Contacts'
   //    );
   //    dispData.emergency_contact = await client.query(econtactInsert, econtactValues).then(getRows(false));

   if (0 === service_discounts.length) dispData.service_discounts = service_discounts;
   else {
    const { fields, rows, values } = SQLfeatures.bulkInsert(
     service_discounts.map(sd => ({ ...sd, is_percentage: sd.is_percentage ?? '%DEFAULT%' })),
     { patient_id: dispData.patient.id }
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
