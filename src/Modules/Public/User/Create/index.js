module.exports =
 ({ all, login }) =>
 app => {
  require('./login')(login)(app);
  require('./all')(all)(app);
 };
