const jwt = require('jsonwebtoken');
const { ROLES } = require('.');
// const pool = require('../pool');

const rowMode = 'array';

module.exports = [
 (req, res, next) => {
  const token = req.headers['x-access-token'];
  const secret = 'jwt-MIND-2023';
  try {
   jwt.verify(token, secret);
   const { db } = res.locals.utils;
   db
    .query({
     name: 'SELECT-ROLE',
     text: 'SELECT id, role_id FROM public."Users" WHERE jwt_token = $1',
     values: [token],
     rowMode,
    })
    .then(({ rows }) => {
     if (0 === rows.length) return res.status(401).json({ success: false, message: 'Token was not found.' });

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

  const { db } = res.locals.utils;
  db
   .query({
    name: 'CHECK_PERMISSION',
    text: `SELECT 1 
           FROM public."Role_Routes" rr 
            JOIN public."Rest_Routes" rer ON rr.rest_route_id = rer.id 
            WHERE $1 = 5 OR (role_id = $1
             AND route = $2
             AND method = $3)`.replace(/\s+/g, ' '),
    values: [res.locals.role_id, pathname, method],
    rowMode: 'array',
   })
   .then(({ rows }) => {
    if (0 === rows.length)
     return res.status(401).json({ success: false, message: 'You are not authorized to perform this action.' });

    next();
   });
 },

 (_, res, next) => {
  const INTSERERR = 'Internal server error contact system administrator.';

  const {
   locals: { role_id, user_id },
  } = res;
  const { db } = res.locals.utils;

  if (ROLES.SUPERADMIN === role_id || ROLES.ADMINISTRATION === role_id) next();
  else {
   switch (role_id) {
    case ROLES.THERAPIST:
     db
      .query({
       name: 'get-therapist-id',
       text: 'SELECT id FROM public."Doctors" WHERE user_id = $1 AND TRUE = is_therapist',
       values: [user_id],
       rowMode,
      })
      .then(({ rows }) => {
       if (0 === rows.length) return res.status(500).json({ success: false, message: INTSERERR });

       res.locals.therapist_id = parseInt(rows[0][0]);

       next();
      });
     break;
    case ROLES.DOCTOR:
     db
      .query({
       name: 'get-doctor-id',
       text: 'SELECT id FROM public."Doctors" WHERE user_id = $1 AND FALSE = is_therapist',
       values: [user_id],
       rowMode,
      })
      .then(({ rows }) => {
       if (0 === rows.length) return res.status(500).json({ success: false, message: INTSERERR });

       res.locals.doctor_id = parseInt(rows[0][0]);

       next();
      });
     break;
    case ROLES.PATIENT:
     db
      .query({
       name: 'get-patients-id',
       text: 'SELECT id FROM public."Patients" WHERE user_id = $1 ',
       values: [user_id],
       rowMode,
      })
      .then(({ rows }) => {
       if (0 === rows.length) return res.status(500).json({ success: false, message: INTSERERR });

       res.locals.patient_id = parseInt(rows[0][0]);

       next();
      });
     break;
   }
  }
 },
];
