module.exports = (app, db) => {
 // const routes =  routes
 require('./daily-report')('/REST/report-daily')(app, db);
 require('./payment')('/REST/payments')(app, db);
 };
