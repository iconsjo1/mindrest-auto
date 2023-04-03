module.exports = (app, db) => {
 require('./Home')('/REST/prescriptions')(app, db);
 require('./Prescription_Lab_Test')('/REST/prescription_lab_tests')(app, db);
 require('./Prescription_Medicine')('/REST/prescription_medicines')(app, db);
 require('./Prescription_Text')('/REST/prescription_texts')(app, db);
 require('./Prescription_Text/Prescription_Text_Type/Read')('/REST/prescription_text_types')(
  app,
  db
 );
};
