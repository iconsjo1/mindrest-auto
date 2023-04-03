module.exports =
 ({ all, login }) =>
 (app, db) => {
  require('./login')(login)(app, db);
  require('./all')(all)(app, db);
 };
