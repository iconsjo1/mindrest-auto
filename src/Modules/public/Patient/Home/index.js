module.exports =
 ({ idnum, patients: { patients, patientsMark }, pcontactInfo, newPatiant }) =>
 app => {
  require('./Common')({ idnum, patients, pcontactInfo })(app);

  if (true === app.audit) require('./audit')({ patients, patientsMark, newPatiant })(app);
  else require('./no-audit')({ patients, patientsMark, newPatiant })(app);
 };
