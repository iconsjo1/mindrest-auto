const routes = {
 services: '/REST/services',
 servicec: '/REST/service_categories',
 servicep: '/REST/service_providers',
};

module.exports = (app, db) => {
 const { services, servicec, servicep } = routes;
 require('./Home')(services)(app, db);
 require('./Service_Category')(servicec)(app, db);
 require('./Service_Provider')(servicep)(app, db);
};
