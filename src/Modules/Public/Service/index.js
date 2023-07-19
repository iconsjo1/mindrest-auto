const routes = {
 services: '/REST/services',
 servicec: '/REST/service_categories',
 servicep: '/REST/service_providers',
};

module.exports = app => {
 const { services, servicec, servicep } = routes;
 require('./Home')(services)(app);
 require('./Service_Category')(servicec)(app);
 require('./Service_Provider')(servicep)(app);
};
