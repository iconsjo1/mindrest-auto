const route = '/REST/doctor_specialities';

module.exports = app => {
 app.use(route, require('../../Utils/Route_Logger'));

 require('./Read')(route)(app);
 require('./Create')(route)(app);
 require('./Update')(route)(app);
 require('./Delete')(route)(app);
};