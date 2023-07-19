module.exports = (app, db) => {
 const route = '/REST/vital_signs';
 
 const logger =require('../../../Utils/Route_Logger')

app.use(route,logger)

 require('./Read')(route)(app, db);
 require('./Create')(route)(app, db);
 require('./Update')(route)(app, db);
 require('./Delete')(route)(app, db);
};
