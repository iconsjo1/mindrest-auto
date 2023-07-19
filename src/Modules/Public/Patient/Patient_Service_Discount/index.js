module.exports = route => app => {
 require('./Read')(route)(app);
 require('./Create')(route)(app);
 require('./Delete')(route)(app);
};
