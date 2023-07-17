module.exports = (app, db) => {
 const route = '/REST/vital_signs';

 require('./Read')(route)(app, db);
 require('./Create')(route)(app, db);
 require('./Update')(route)(app, db);
 require('./Delete')(route)(app, db);
};
