module.exports = route => app => {
 require('./Create')(route)(app);
 require('./Delete')(route)(app);
 require('./Read')(route)(app);
 require('./Update')(route)(app);
};
