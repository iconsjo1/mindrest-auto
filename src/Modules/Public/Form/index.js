const routes = { form: '/REST/forms', details: '/REST/form_details' };
module.exports = (app, db) => {
 const { form, details } = routes;

 require('./Read')({ form, details })(app, db);
 require('./Create')(form)(app, db);
 require('./Update')(form)(app, db);
 require('./Delete')(form)(app, db);
};
