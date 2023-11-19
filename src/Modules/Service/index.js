const routes = {
 services: '/REST/services',
 servicec: '/REST/service_categories',
};
module.exports = app => {
 const { services, servicec } = routes;
 app.use([services, servicec], require('../../Utils/Route_Logger'));
 require('./Home')(services)(app);
 require('./Service_Category')(servicec)(app);
};
