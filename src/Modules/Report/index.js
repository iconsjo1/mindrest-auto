const routes = {
 daily: '/REST/report-daily',
 payment: '/REST/payments',
};

module.exports = app => {
 const { daily, payment } = routes;

 const logger = require('../../Utils/Route_Logger');

 app.get(daily, logger);
 app.get(payment, logger);

 require('./daily-report')(daily)(app);
 require('./payment')(payment)(app);
};
