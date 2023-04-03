const express = require('express');
const app = express();
const cors = require('cors');
const db = require('./pool');

// middleware
app.use(cors());
const flatData = (req, _, next) => {
 for (let prop in req.body) {
  if (
   'object' === typeof req.body[prop] &&
   null != req.body[prop] &&
   !Array.isArray(req.body[prop])
  )
   req.body = { ...req.body, [prop]: req.body[prop].value };
 }
 next();
};

app.post('*', [express.json(), flatData]);
app.put('*', [express.json(), flatData]);

app.use((_, res, next) => {
 res.locals.utils = { db, ...require('../src/Utils') };
 res.set('Access-Control-Allow-Origin', '*');
 next();
});

// routs

require('./Modules')(app, db);

app.listen(process.env.PORT, () => {
 console.clear();
 console.log('Server started\n');

 let routes = [];
 app._router.stack.forEach(r => {
  if (r?.route?.path && '*' !== r.route.path) {
   routes.push({
    path: r.route.path.substring(5),
    method: Object.keys(r.route.methods).join(',').toUpperCase(),
   });
  }
 });

 console.log('Number of routes: %i\n', routes.length);

 routes = routes.reduce((acc, { path }) => {
  acc[path] = routes
   .filter(rf => path === rf.path)
   .map(({ method }) => method)
   .sort()
   .join(', ');
  return acc;
 }, {});

 console.table(
  Object.keys(routes)
   .sort((a, b) => b - a)
   .reduce((acc, k) => {
    acc[k] = routes[k];
    return acc;
   }, {})
 );
});
