module.exports =
 ({ all, login, logout, usersMark }) =>
 app => {
  require('./Create')({ all, login })(app);
  require('./Update')(all)(app);
  require('./Patch')(usersMark)(app);
  require('./Delete')(logout)(app);
 };
