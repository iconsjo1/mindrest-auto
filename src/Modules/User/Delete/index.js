module.exports =
 ({ all, logout }) =>
 app => {
  require('./all')(all)(app);
  require('./logout')(logout)(app);
 };
