module.exports = route => app => {
 app.use(route, require('../../../Utils/Route_Logger'));
 require('./Create')(route.documents)(app);
 require('./Delete')(route.documents)(app);
 require('./Read')(route)(app);
};
