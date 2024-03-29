const routes = { medicine: '/REST/medicines', mtf: '/REST/medicine_to_foods' };

module.exports = app => {
 const { medicine, mtf } = routes;

 require('./Read')({ medicine, mtf })(app);
 require('./Create')(medicine)(app);
 require('./Update')(medicine)(app);
 require('./Delete')(medicine)(app);
};
