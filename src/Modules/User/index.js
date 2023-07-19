const routes = { all: '/REST/users', login: '/REST/user/login' };

module.exports = app => {
 const { all, login } = routes;
 const logger = require('../../Utils/Route_Logger');

 app.use(all, logger);
 app.post(login, logger);

 require('./Read')(all)(app);
 require('./Create')({ all, login })(app);
 require('./Update')(all)(app);
 require('./Delete')(all)(app);
};
