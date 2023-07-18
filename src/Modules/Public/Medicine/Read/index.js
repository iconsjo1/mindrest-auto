module.exports =
 ({ medicine, mtf }) =>
 (app, db) => {
  require('./Medicine_to_Food')(mtf)(app, db);
  require('./Read')(medicine)(app, db);
 };
