const { isPositiveInteger } = require('./');

module.exports = limit => {
 let limitClause = 'LIMIT ';

 if (isPositiveInteger(limit)) {
  limitClause += limit;
 } else if (limit === process.env.DB_NO_LIMIT_FLAG) {
  limitClause += 'ALL';
 } else {
  limitClause += process.env.DB_DEFAULT_ROWS_LIMIT;
 }

 return limitClause;
};
