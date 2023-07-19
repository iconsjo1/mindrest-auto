const routes = { edit: '/REST/doctor_schedules', report: '/REST/doctor_schedules/report' };

module.exports = app => {
 const { edit, report } = routes;
 const logger = require('../../Utils/Route_Logger');

 app.use(edit, logger);
 app.get(report, logger);

 require('./Read')({ edit, report })(app);
 require('./Create')(edit)(app);
 require('./Update')(edit)(app);
 require('./Delete')(edit)(app);
};
