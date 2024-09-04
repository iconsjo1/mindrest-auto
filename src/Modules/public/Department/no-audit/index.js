module.exports =
 ({ all, markDepartment }) =>
 app => {
  require('./Create')(all)(app);
  require('./Patch')(markDepartment)(app);
  require('./Update')(all)(app);
 };
