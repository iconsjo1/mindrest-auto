const routes = {
 cat: '/REST/document_categories',
 document: { documents: '/REST/documents', document: '/REST/document' },
};

module.exports = (app, db) => {
 const {
  cat,
  document: { documents, document },
 } = routes;

 require('./Document_Category')(cat)(app, db);
 require('./Home')({ documents, document })(app, db);
};
