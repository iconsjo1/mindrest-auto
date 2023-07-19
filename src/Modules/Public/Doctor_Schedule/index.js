const routes = { edit: '/REST/doctor_schedules', report: '/REST/doctor_schedules/report' };

module.exports = (app, db) => {
 const { edit, report } = routes;

 require('./Read')({ edit, report })(app, db);
 require('./Create')(edit)(app, db);
 require('./Update')(edit)(app, db);
 require('./Delete')(edit)(app, db);
};
