const routes = {
 patient: {
  idnum: '/REST/patients/unique_idnumber',
  patients: { patients: '/REST/patients', patientsMark: '/REST/mark-patients' },
  newPatiant: '/REST/new-patient',
  pcontactInfo: '/REST/patient_contact_info',
 },
 answer: '/REST/patient_answers',
 deposite: '/REST/patient_deposites',
 document: '/REST/patient_documents',
 discount: '/REST/patient_service_discounts',
 note: '/REST/patients_notes',
};

module.exports = app => {
 const {
  patient: { idnum, patients, pcontactInfo, newPatiant },
  answer,
  deposite,
  document,
  discount,
  note,
 } = routes;

 require('./Home')({
  idnum,
  patients,
  pcontactInfo,
  newPatiant,
 })(app);
 require('./Patient_Answer')(answer)(app);
 require('./Patient_Deposite')(deposite)(app);
 require('./Patient_Document')(document)(app);
 require('./Patient_Service_Discount')(discount)(app);
 require('./Patients_Notes')(note)(app);
};
