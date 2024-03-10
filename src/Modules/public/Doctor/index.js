const routes = {
 all: '/REST/doctors',
 contact_info: '/REST/doctor_contact_info',
 doctor_patients: '/REST/doctor_patients',
 newDoctor: '/REST/new-doctor',
};

module.exports = app => {
 const { all, contact_info, doctor_patients, newDoctor } = routes;

 require('./Read')({ all, contact_info, doctor_patients })(app);
 require('./Create')({ all, newDoctor })(app);
 require('./Update')(all)(app);
 require('./Delete')(all)(app);
};
