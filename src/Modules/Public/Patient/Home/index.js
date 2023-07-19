module.exports = route => app => {
 require('./Read')(route)(app);
 require('./Create')(route.patients)(app);
 require('./Update')(route.patients)(app);
 require('./Delete')(route.patients)(app);
};
