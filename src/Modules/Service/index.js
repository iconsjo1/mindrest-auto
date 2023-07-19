const routes = {
 services: '/REST/services',
 servicec: '/REST/service_categories',
 servicep: '/REST/service_providers',
};

module.exports = app => {
 const { services, servicec, servicep } = routes;

 app.use([services, servicec, servicep], require('../../Utils/Route_Logger'));

 require('./Home')(services)(app);
 require('./Service_Category')(servicec)(app);
 require('./Service_Provider')(servicep)(app);
};
