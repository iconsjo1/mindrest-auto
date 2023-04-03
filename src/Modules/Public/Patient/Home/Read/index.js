module.exports =
 ({ idnum, patients, pcontactInfo }) =>
 (app, db) => {
  require('./Patient_Contact_Information')(pcontactInfo)(app, db);
  require('./Check_Unique_Idnumber')(idnum)(app, db);
  require('./Read')(patients)(app, db);
 };
