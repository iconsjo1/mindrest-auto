module.exports = (app, db) => {
 require('./Home')({
  idnum: '/REST/patients/unique_idnumber',
  patients: '/REST/patients',
  pcontactInfo: '/REST/patient_contact_info',
 })(app, db);
 require('./Patient_Answer')('/REST/patient_answers')(app, db);
 require('./Patient_Deposite')('/REST/patient_deposites')(app, db);
 require('./Patient_Document')('/REST/patient_documents')(app, db);
 require('./Patient_Service_Discount')('/REST/patient_service_discounts')(app, db);
};
