module.exports = (app, db) => {
 require('./Home')('/REST/services')(app, db);
 require('./Service_Category')('/REST/service_categories')(app, db);
 require('./Service_Provider')('/REST/service_providers')(app, db);
};
