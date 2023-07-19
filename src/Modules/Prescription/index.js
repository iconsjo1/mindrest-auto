const routes = {
 prescription: '/REST/prescriptions',
 lab_tests: '/REST/prescription_lab_tests',
 medicine: '/REST/prescription_medicines',
 text: '/REST/prescription_texts',
 text_type: '/REST/prescription_text_types',
};

module.exports = app => {
 const { prescription, lab_tests, medicine, text, text_type } = routes;

 const logger = require('../../Utils/Route_Logger');

 app.use([prescription, lab_tests, text], logger);
 app.post(medicine, logger);
 app.get(medicine, logger);
 app.get(text_type, logger);
 app.delete(medicine, logger);

 require('./Home')(prescription)(app);
 require('./Prescription_Lab_Test')(lab_tests)(app);
 require('./Prescription_Medicine')(medicine)(app);
 require('./Prescription_Text')(text)(app);
 require('./Prescription_Text/Prescription_Text_Type/Read')(text_type)(app);
};
