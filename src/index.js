const express = require('express');
const app = express();
const cors = require('cors');
const db = require('./pool');
const PORT = 5040;

// middleware
app.use(cors());
const flatData = (req, _, next) => {
 for (let prop in req.body) {
  if (
   'object' === typeof req.body[prop] &&
   null != req.body[prop] &&
   !Array.isArray(req.body[prop])
  )
  console.log('here');
   //req.body = { ...req.body, [prop]: req.body[prop].value };
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

require('./Modules')(app);

app.listen(PORT, () => {
 console.clear();
 console.log('Server started on port %s', PORT);

 let routes = [];
 app._router.stack.forEach(r => {
  if (r?.route?.path && '*' !== r.route.path) {
   routes.push({
    path: r.route.path.substring(5),
    method: Object.keys(r.route.methods).join(',').toUpperCase(),
   });
  }
 });

 console.log('Number of routes: %i', routes.length);

 routes = routes.reduce((acc, { path }) => {
  acc[path] = Array.from(
   new Set(
    routes
     .reduce((acc, { method, path: rf_path }) => {
      if (rf_path === path) acc.push(method);
      return acc;
     }, [])
     .sort()
   )
  ).join(', ');
  return acc;
 }, {});

 console.table(
  Object.keys(routes)
   .sort((a, b) => b - a)
   .reduce(
    (acc, k) => ({ ...acc, [++Object.keys(acc).length]: { path: k, method: routes[k] } }),
    {}
   )
 );
});
