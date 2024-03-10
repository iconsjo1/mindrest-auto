const route = '/REST/bill_services';

module.exports = app => {
 require('./Read')(route)(app);
 require('./Create')(route)(app);
 require('./Delete')(route)(app);
};
