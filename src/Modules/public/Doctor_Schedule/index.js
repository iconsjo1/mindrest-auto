const routes = { edit: '/REST/doctor_schedules', report: '/REST/doctor_schedules/report' };

module.exports = app => {
 const { edit, report } = routes;

 require('./Read')({ edit, report })(app);
 require('./Create')(edit)(app);
 require('./Update')(edit)(app);
 require('./Delete')(edit)(app);
};
