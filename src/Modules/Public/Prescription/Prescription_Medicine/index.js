module.exports = route => app => {
 app.use(route, require('../../../Utils/Route_Logger'));
 require('./Read')(route)(app);
 require('./Create')(route)(app);
 require('./Delete')(route)(app);
};
