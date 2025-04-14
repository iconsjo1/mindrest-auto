const express = require('express');
const app = express();
const cors = require('cors');
const compression = require('compression');
const db = require('./pool');

const { FUNCTIONALAUDIT, APPPORT, route_logger, ...utils } = require('../src/Utils');

// middlewares

const flatData = (req, _, next) => {
 if (/new-(patient|doctor)(\?.*)?$/.test(req._parsedUrl.path)) {
  next();
 } else {
  for (let prop in req.body) {
   if ('object' === typeof req.body[prop] && null != req.body[prop] && !Array.isArray(req.body[prop]))
    req.body = { ...req.body, [prop]: req.body[prop].value };
  }
  next();
 }
};

app.use([
 cors(),
 compression(),
 (req, res, next) => {
  res.locals.utils = { db, ...utils };
  res.set('Access-Control-Allow-Origin', '*');

  if (['POST', 'PUT'].includes(req.method)) return express.json()(req, res, () => flatData(req, res, next));
  next();
 },
 route_logger,
]);

// routes
app.audit = FUNCTIONALAUDIT;
require('./Modules')(app);

app.listen(APPPORT, () => {
 console.clear();
 console.log('Server started on port %s', APPPORT);

 const { stack } = app.router;

 const routes = stack
  .reduce((acc, r) => {
   if (r?.route?.path)
    acc.push({ path: r.route.path.substring(5), method: Object.keys(r.route.methods).join(',').toUpperCase() });

   return acc;
  }, [])
  .reduce(
   (outAcc, route, _, self) =>
    Object.assign(outAcc, {
     [route.path]: self.reduce((inAcc, s) => {
      if (s.path === route.path) inAcc.push(s.method);

      return inAcc;
     }, []),
    }),
   {}
  );

 console.log('Number of routes: %i', stack.filter(s => 'handle' === s.name).length);

 const fixedMethods = { POST: 'POST', GET: 'GET', PUT: 'PUT', DELETE: 'DELETE', PATCH: 'PATCH' };

 console.table(
  Object.keys(routes)
   .sort((a, b) => b - a)
   .reduce((acc, k) => {
    const methods = {};
    routes[k].forEach(r => (methods[r] = fixedMethods[r]));

    return { ...acc, [++Object.keys(acc).length]: { Path: k, ...methods } };
   }, {}),
  ['Path'].concat(Object.values(fixedMethods))
 );
});
