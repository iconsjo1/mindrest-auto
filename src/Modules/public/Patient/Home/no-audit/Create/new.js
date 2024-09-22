module.exports = route => app => {
 // Create Patient [ALL DATA]
 app.post(route, async (req, res) => {
  let client = null;
  let begun = false;

  try {
   const dispData = {};

   const {
    db,
    isValidObject,
    SQLfeatures,
    isEObjArray,
    env: {
     ERP: { CUSTOMER },
    },
   } = res.locals.utils;

   const { user, contact, patient, emergency_contact, service_discounts = [] } = req.body;

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

   const dbSQLInsert = (data, tableName) => {
    const fields = Object.keys(data);
    const values = Object.values(data);
    const enc_values = values.map((_, i) => `$${++i}`);
    return [`INSERT INTO public."${tableName}"(${fields}) VALUES(${enc_values}) RETURNING *`, values];
   };
   const getRows = oneRow => (false === oneRow ? ({ rows }) => rows[0] : ({ rows }) => rows);

   client = await db.connect();
   await client.query('BEGIN').then(() => (begun = true));

   const [userSQL, userValues] = dbSQLInsert(user, 'Users');
   dispData.user = await client.query(userSQL, userValues).then(getRows(false));

   const [contactSQL, contactValues] = dbSQLInsert({ ...contact, user_id: dispData.user.id }, 'Contacts');
   dispData.contact = await client.query(contactSQL, contactValues).then(getRows(false));

   const [patientSQL, patientValues] = dbSQLInsert({ ...patient, user_id: dispData.user.id }, 'Patients');
   dispData.patient = await client.query(patientSQL, patientValues).then(getRows(false));

   const { id: patient_id } = dispData.patient;

   const [econtactSQL, econtactValues] = dbSQLInsert({ ...emergency_contact, patient_id }, 'Emergency_Contacts');
   dispData.emergency_contact = await client.query(econtactSQL, econtactValues).then(getRows(false));

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
   dispData.customer_data = await CUSTOMER.create(dispData.user.customer_ref, user.country_id);

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
