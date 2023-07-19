module.exports = route => app => {
    app.use(route, require('../../../Utils/Route_Logger'));
 require('./Read')(route)(app);
 require('./Create')(route.patients)(app);
 require('./Update')(route.patients)(app);
 require('./Delete')(route.patients)(app);
};
