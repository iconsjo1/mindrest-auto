module.exports = route => (app, db) => {
 require('./Read')(route)(app, db);
 require('./Create')(route.patients)(app, db);
 require('./Update')(route.patients)(app, db);
 require('./Delete')(route.patients)(app, db);
};
