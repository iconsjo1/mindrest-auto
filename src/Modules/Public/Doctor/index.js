const route = {
 all: '/REST/doctors',
 contact_info: '/REST/doctor_contact_info',
 doctor_patients: '/REST/doctor_patients',
};

module.exports = (app, db) => {
 require('./Read')(route)(app, db);
 require('./Create')(route.all)(app, db);
 require('./Update')(route.all)(app, db);
 require('./Delete')(route.all)(app, db);
};
