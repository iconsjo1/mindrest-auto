module.exports =
 ({ patients, patientsMark, newPatiant }) =>
 app => {
  require('./Create')({ patients, newPatiant })(app);
  require('./Patch')(patientsMark)(app);
  require('./Update')(patients)(app);
 };
