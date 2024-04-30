const auth = require('../../../Utils/Auth');

const routes = {
 all: '/REST/users',
 login: '/REST/user/login',
 logout: '/REST/user-logout',
 usersMark: '/REST/mark-users',
};

module.exports = app => {
 const { all, login, logout, usersMark } = routes;

 app.post(all, auth);
 app.delete(logout, auth);
 app.delete(all, auth);
 app.get(all, auth);
 app.put(all, auth);
 app.patch(usersMark, auth);

 app.use([all, login, logout, usersMark], (_, res, next) => {
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
 });

 require('./Common')(all)(app);
 if (true === app.audit) require('./audit')(routes)(app);
 else require('./no-audit')(routes)(app);
};
