module.exports = route => app => {
 require('./Create')(route.documents)(app);
 require('./Delete')(route.documents)(app);
 require('./Read')(route)(app);
};
