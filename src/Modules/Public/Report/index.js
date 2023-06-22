module.exports = (app, db) => {
 // const routes =  routes
 require('./daily-report')('/REST/report-daily')(app, db);
 /* require('./Create')(route)(app, db);
 require('./Update')(route)(app, db);
 require('./Delete')(route)(app, db);*/
};
