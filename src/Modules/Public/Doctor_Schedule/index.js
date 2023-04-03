const route = { edit: '/REST/doctor_schedules', report: '/REST/doctor_schedules/report' };

module.exports = (app, db) => {
 require('./Read')(route)(app, db);
 require('./Create')(route.edit)(app, db);
 require('./Update')(route.edit)(app, db);
 require('./Delete')(route.edit)(app, db);
};
