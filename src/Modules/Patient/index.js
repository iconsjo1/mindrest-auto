const routes = {
 patient: {
  idnum: '/REST/patients/unique_idnumber',
  patients: '/REST/patients',
  pcontactInfo: '/REST/patient_contact_info',
 },
 answer: '/REST/patient_answers',
 deposite: '/REST/patient_deposites',
 document: '/REST/patient_documents',
 discount: '/REST/patient_service_discounts',
};

module.exports = app => {
 const {
  patient: { idnum, patients, pcontactInfo },
  answer,
  deposite,
  document,
  discount,
 } = routes;
 const logger = require('../../Utils/Route_Logger');

 app.use([answer, deposite, document, discount, patients], logger);

 app.get(idnum, logger);
 app.get(pcontactInfo, logger);

 require('./Home')({
  idnum,
  patients,
  pcontactInfo,
 })(app);
 require('./Patient_Answer')(answer)(app);
 require('./Patient_Deposite')(deposite)(app);
 require('./Patient_Document')(document)(app);
 require('./Patient_Service_Discount')(discount)(app);
};
