const routes = {
 prescription: '/REST/prescriptions',
 lab_tests: '/REST/prescription_lab_tests',
 medicine: '/REST/prescription_medicines',
 text: '/REST/prescription_texts',
 text_type: '/REST/prescription_text_types',
};

module.exports = (app, db) => {
 const { prescription, lab_tests, medicine, text, text_type } = routes;
 require('./Home')(prescription)(app, db);
 require('./Prescription_Lab_Test')(lab_tests)(app, db);
 require('./Prescription_Medicine')(medicine)(app, db);
 require('./Prescription_Text')(text)(app, db);
 require('./Prescription_Text/Prescription_Text_Type/Read')(text_type)(app, db);
};
