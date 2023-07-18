const routes = { medicine: '/REST/medicines', mtf: '/REST/medicine_to_foods' };
module.exports = (app, db) => {
 const { medicine, mtf } = routes;
 require('./Read')({ medicine, mtf })(app, db);
 require('./Create')(medicine)(app, db);
 require('./Update')(medicine)(app, db);
 require('./Delete')(medicine)(app, db);
};
