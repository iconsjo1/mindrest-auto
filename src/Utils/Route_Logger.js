const pool = require('../pool');

module.exports = (_, res, next) => {
 const {
  req: {
   _parsedUrl: { pathname },
   method,
  },
 } = res;

 pool
  .query({
   name: 'route_select',
   text: 'SELECT 1 FROM public."Rest_Routes" WHERE method = $1 AND route = $2',
   values: [method, pathname],
   rowMode: 'array',
  })
  .then(({ rows }) => {
   if (0 === rows.length) {
    pool
     .query({
      name: 'route_insert',
      text: 'INSERT INTO public."Rest_Routes"(method, route) SELECT $1, $2',
      values: [method, pathname],
     })
     .then(_ => next());
   } else next();
  });
};
