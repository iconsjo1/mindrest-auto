module.exports = route => (app, db) => {
 require('./Read')(route)(app, db);
 require('./Create')(route)(app, db);
 require('./Delete')(route)(app, db);
};