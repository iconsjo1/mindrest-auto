module.exports =
 ({ document, documents }) =>
 app => {
  require('./document')(document)(app);
  require('./documents')(documents)(app);
 };
