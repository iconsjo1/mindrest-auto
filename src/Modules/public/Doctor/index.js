module.exports = app => {
 const { all, contact_info, doctor_patients, newDoctor, markDoctors } = {
  all: '/REST/doctors',
  contact_info: '/REST/doctor_contact_info',
  doctor_patients: '/REST/doctor_patients',
  newDoctor: '/REST/new-doctor',
  markDoctors: '/REST/mark-doctors',
 };

 require('./common')({ all, contact_info, doctor_patients })(app);

 if (true === app.audit) require('./audit')({ all, newDoctor, markDoctors })(app);
 else require('./no-audit')({ all, newDoctor, markDoctors })(app);
};
