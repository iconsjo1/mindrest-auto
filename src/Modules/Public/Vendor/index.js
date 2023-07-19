const route = '/Rest/vendors';

module.exports = (app, db) => {
app.use(route, require('../../../Utils/Route_Logger'));

 require('./Read')(route)(app, db);
 require('./Create')(route)(app, db);
 require('./Update')(route)(app, db);
 require('./Delete')(route)(app, db);
};
