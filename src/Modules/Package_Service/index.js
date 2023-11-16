const route = '/REST/package_services';

module.exports = app => {
 app.use(route, require('../../Utils/Route_Logger'));

 require('./Read')(route)(app);
 require('./Create')(route)(app);
 require('./Delete')(route)(app);
};
