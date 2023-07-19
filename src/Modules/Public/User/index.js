const routes = { all: '/REST/users', login: '/REST/user/login' };

module.exports = app => {
 const { all, login } = routes;
 require('./Read')(all)(app);
 require('./Create')({ all, login })(app);
 require('./Update')(all)(app);
 require('./Delete')(all)(app);
};
