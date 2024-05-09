module.exports =
 ({ all, newDoctor, markDoctors }) =>
 app => {
  require('./Create')({ all, newDoctor })(app);
  require('./Patch')(markDoctors)(app);
  require('./Update')(all)(app);
 };
