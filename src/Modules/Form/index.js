const routes = { form: '/REST/forms', details: '/REST/form_details' };
module.exports = app => {
 const { form, details } = routes;

 const logger = require('../../Utils/Route_Logger');

 app.use(form, logger);
 app.get(details, logger);

 require('./Read')({ form, details })(app);
 require('./Create')(form)(app);
 require('./Update')(form)(app);
 require('./Delete')(form)(app);
};
