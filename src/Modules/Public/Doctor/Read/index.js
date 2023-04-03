module.exports =
 ({ all, contact_info, doctor_patients }) =>
 (app, db) => {
  require('./allData')(all)(app, db);
  require('./Doctot_Contact_info')(contact_info)(app, db);
  require('./doctor_patients')(doctor_patients)(app, db);
 };
