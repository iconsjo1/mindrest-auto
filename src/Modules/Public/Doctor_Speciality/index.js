const route = '/REST/doctor_specialities';

module.exports = app => {
 require('./Read')(route)(app);
 require('./Create')(route)(app);
 require('./Update')(route)(app);
 require('./Delete')(route)(app);
};
