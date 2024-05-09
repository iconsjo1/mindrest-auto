module.exports =
 ({ all, newDoctor }) =>
 app => {
  require('./all')(all)(app);
  require('./new')(newDoctor)(app);
 };
