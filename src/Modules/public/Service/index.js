const routes = {
 services: '/REST/services',
 servicec: '/REST/service_categories',
};
module.exports = app => {
 const { services, servicec } = routes;

 require('./Home')(services)(app);
 require('./Service_Category')(servicec)(app);
};
