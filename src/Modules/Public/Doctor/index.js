const routes = {
 all: '/REST/doctors',
 contact_info: '/REST/doctor_contact_info',
 doctor_patients: '/REST/doctor_patients',
};

module.exports = (app, db) => {
 const { all, contact_info, doctor_patients } = routes;

 require('./Read')({ all, contact_info, doctor_patients })(app, db);
 require('./Create')(all)(app, db);
 require('./Update')(all)(app, db);
 require('./Delete')(all)(app, db);
};
