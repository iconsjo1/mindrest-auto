const route = '/REST/visits';

module.exports = app => {
 app.use(route, require('../../../Utils/Route_Logger'));

 require('./Read')(route)(app);
 require('./Create')(route)(app);
 require('./Update')(route)(app);
 require('./Delete')(route)(app);
};
