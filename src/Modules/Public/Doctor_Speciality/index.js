const route = '/REST/doctor_specialities';

module.exports = (app, db) => {
 require('./Read')(route)(app, db);
 require('./Create')(route)(app, db);
 require('./Update')(route)(app, db);
 require('./Delete')(route)(app, db);
};
