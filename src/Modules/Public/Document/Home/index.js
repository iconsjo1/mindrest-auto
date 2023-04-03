module.exports = route => (app, db) => {
 require('./Create')(route.documents)(app, db);
 require('./Delete')(route.documents)(app, db);
 require('./Read')(route)(app, db);
};
