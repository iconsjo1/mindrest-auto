const routes = { all: '/REST/users', login: '/REST/user/login' };

module.exports = (app, db) => {
 const { all, login } = routes;
 require('./Read')(all)(app, db);
 require('./Create')({ all, login })(app, db);
 require('./Update')(all)(app, db);
 require('./Delete')(all)(app, db);
};
