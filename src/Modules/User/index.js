// const auth = require('../../Utils/Auth');

const routes = {
 all: '/REST/users',
 login: '/REST/user/login',
 logout: '/REST/user-logout',
};

module.exports = app => {
 const { all, login, logout } = routes;

 //  app.post(all, auth);
 //  app.delete(logout, auth);
 //  app.delete(all, auth);
 //  app.get(all, auth);
 //  app.put(all, auth);

 app.use(
  [all, login, logout],
  [
   require('../../Utils/Route_Logger'),
   (_, res, next) => {
    res.locals.user_columns = [
     'id',
     'title_id',
     'user_first_name',
     'user_middle_name',
     'user_last_name',
     'dob',
     'email',
     'user_contact_number',
     'country_id',
     'avatar_id',
     'role_id',
     'jwt_token',
    ];
    next();
   },
  ]
 );

 require('./Read')(all)(app);
 require('./Create')({ all, login })(app);
 require('./Update')(all)(app);
 require('./Delete')({ all, logout })(app);
};
