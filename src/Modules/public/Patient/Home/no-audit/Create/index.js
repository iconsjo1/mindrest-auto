module.exports =
 ({ patients, newPatiant }) =>
 app => {
  require('./all')(patients)(app);
  require('./new')(newPatiant)(app);
 };
