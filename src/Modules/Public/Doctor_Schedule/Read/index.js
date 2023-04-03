module.exports =
 ({ edit, report }) =>
 (app, db) => {
  require('./edit')(edit)(app, db);
  require('./report')(report)(app, db);
 };
