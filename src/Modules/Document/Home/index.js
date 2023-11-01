module.exports =
 ({ documents, do_documents }) =>
 app => {
  require('./Create')(do_documents)(app);
  require('./Read')({ documents, do_documents })(app);
 };
