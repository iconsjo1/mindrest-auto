module.exports =
 ({ idnum, patients, pcontactInfo }) =>
 app => {
  require('./Patient_Contact_Information')(pcontactInfo)(app);
  require('./Check_Unique_Idnumber')(idnum)(app);
  require('./Read')(patients)(app);
 };
