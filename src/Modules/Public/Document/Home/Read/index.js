module.exports =
 ({ document, documents }) =>
 (app, db) => {
  require('./document')(document)(app, db);
  require('./documents')(documents)(app, db);
 };
