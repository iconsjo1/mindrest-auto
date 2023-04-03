module.exports = (app, db) => {
 require('./Document_Category')('/REST/document_categories')(app, db);
 require('./Home')({ documents: '/REST/documents', document: '/REST/document' })(app, db);
};
