module.exports =
 ({ appointment, appointmentMark }) =>
 app => {
  require('./Create')(appointment)(app);
  require('./Update')(appointment)(app);
  require('./Patch')(appointmentMark)(app);
 };
