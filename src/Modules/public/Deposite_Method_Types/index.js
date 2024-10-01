const route = '/REST/deposite_method_types';

module.exports = app => {
 require('./Read')(route)(app);
};
