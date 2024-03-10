module.exports = app => {
 const route = '/REST/doctor_timeouts';

 require('./Read')(route)(app);
 require('./Create')(route)(app);
 require('./Update')(route)(app);
 require('./Delete')(route)(app);
};
