const routes = { daily: '/REST/report-daily', payment: '/REST/payments' };

module.exports = app => {
 const { daily, payment } = routes;

 require('./daily-report')(daily)(app);
 require('./payment')(payment)(app);
};
