module.exports = app => {
 const route = '/REST/doctor_holidays';

 require('./Read')(route)(app);
 require('./Create')(route)(app);
 require('./Update')(route)(app);
 require('./Delete')(route)(app);
};
