module.exports =
 ({ documents, do_documents }) =>
 app => {
  require('./documents')(documents)(app);
  require('./DO-read')(do_documents)(app);
 };
