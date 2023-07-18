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

module.exports = (app, db) => {
 const {
  patient: { idnum, patients, pcontactInfo },
  answer,
  deposite,
  document,
  discount,
 } = routes;

 require('./Home')({
  idnum,
  patients,
  pcontactInfo,
 })(app, db);
 require('./Patient_Answer')(answer)(app, db);
 require('./Patient_Deposite')(deposite)(app, db);
 require('./Patient_Document')(document)(app, db);
 require('./Patient_Service_Discount')(discount)(app, db);
};
