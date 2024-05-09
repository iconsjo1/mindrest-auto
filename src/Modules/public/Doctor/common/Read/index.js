module.exports =
 ({ all, contact_info, doctor_patients }) =>
 app => {
  require('./allData')(all)(app);
  require('./Doctot_Contact_info')(contact_info)(app);
  require('./doctor_patients')(doctor_patients)(app);
 };
