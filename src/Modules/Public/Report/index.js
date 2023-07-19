module.exports = app => {
 // const routes =  routes
 require('./daily-report')('/REST/report-daily')(app);
 require('./payment')('/REST/payments')(app);
};
