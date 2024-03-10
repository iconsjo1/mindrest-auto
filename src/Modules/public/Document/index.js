const routes = {
 home: {
  documents: '/REST/documents',
  do_documents: '/REST/do_documents',
 },
 cat: '/REST/document_categories',
};

module.exports = app => {
 const {
  home: { documents, do_documents },
  cat,
 } = routes;

 app.use(do_documents, (_, res, next) => {
  res.locals.do = {
   credentials: {
    accessKeyId: '973ed6064ca7b2b632e92ddab9fde782',
    secretAccessKey: '653c20a890739359c769972daf61b948',
    endpoint: 'https://eu2.contabostorage.com/icon',
   },
   bucket: 'icon',
   folder: 'Mind',
  };
  next();
 });

 require('./Home')({ documents, do_documents })(app);
 require('./Document_Category')(cat)(app);
};
