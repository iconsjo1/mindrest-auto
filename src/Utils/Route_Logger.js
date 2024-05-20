const pool = require('../pool');

module.exports = async (_, res, next) => {
 const {
  req: {
   _parsedUrl: { pathname },
   method,
  },
 } = res;

 const { rows } = await pool
  .query({
   name: 'route_select',
   text: 'SELECT 1 FROM public."Rest_Routes" WHERE method = $1 AND route = $2',
   values: [method, pathname],
   rowMode: 'array',
  })
  .catch(({ message }) => {
   throw Error(message);
  });

 if (0 === rows.length) res.json({ success: false, message: 'Resourse was not found.' });
 else next();
};
