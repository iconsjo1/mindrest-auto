const jwt = require('jsonwebtoken');

const pool = require('../pool');

const rowMode = 'array';

module.exports = [
 (req, res, next) => {
  const token = req.headers['x-access-token'];
  const secret = 'jwt-UOA-2023';

  try {
   jwt.verify(token, secret);

   pool
    .query({
     name: 'SELECT-ROLE',
     text: 'SELECT id, role_id FROM public."Users" WHERE jwt_token = $1',
     values: [token],
     rowMode,
    })
    .then(({ rows }) => {
     if (0 === rows.length)
      return res.status(401).json({ success: false, message: 'Token was not found.' });

     res.locals.token = token;
     res.locals.user_id = parseInt(rows[0][0]);
     res.locals.role_id = parseInt(rows[0][1]);

     next();
    });
  } catch ({ message, name }) {
   let msg = '';

   if ('TokenExpiredError' === name) msg = 'Login session expired relogin';
   else if ('JsonWebTokenError' === name) msg = 'Bad login relogin';
   else msg = message;

   res.json({ success: false, message: msg });
  }
 },
 (_, res, next) => {
  const {
   req: {
    _parsedUrl: { pathname },
    method,
   },
  } = res;

  pool
   .query({
    name: 'CHECK_PERMISSION',
    text: `SELECT 1 
           FROM public."Role_Routes" rr 
            JOIN public."Rest_Routes" rer ON rr.rest_route_id = rer.id 
            WHERE $1 IN(5, 26) OR (role_id = $1
             AND route = $2
             AND method = $3)`.replace(/\s+/g, ' '),
    values: [res.locals.role_id, pathname, method],
    rowMode: 'array',
   })
   .then(({ rows }) => {
    if (0 === rows.length)
     return res
      .status(401)
      .json({ success: false, message: 'You are not authorized to perform this action.' });

    next();
   });
 },

 (_, res, next) => {
  const {
   locals: { role_id, user_id },
  } = res;

  if (![5, 26].includes(role_id)) next();
  else {
   switch (role_id) {
    case 1:
     pool
      .query({
       name: 'get-student-id',
       text: 'SELECT id FROM public."Students" WHERE user_id = $1',
       values: [user_id],
       rowMode,
      })
      .then(({ rows }) => {
       if (0 === rows.length)
        return res
         .status(500)
         .json({ success: false, message: 'Internal server error contact system administrator.' });

       res.locals.student_id = parseInt(rows[0][0]);

       next();
      });
     break;
    case 2:
     pool
      .query({
       name: 'get-professor-id',
       text: 'SELECT id FROM public."Professors" WHERE user_id = $1',
       values: [user_id],
       rowMode,
      })
      .then(({ rows }) => {
       if (0 === rows.length)
        return res
         .status(500)
         .json({ success: false, message: 'Internal server error contact system administrator.' });

       res.locals.professor_id = parseInt(rows[0][0]);

       next();
      });
     break;
   }
  }
 },
];
