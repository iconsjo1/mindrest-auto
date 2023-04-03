module.exports = (app, db) => {
 require('./Read')(app, db);
 require('./Create')(app, db);
 require('./Update')(app, db);
 require('./Delete')(app, db);
};
