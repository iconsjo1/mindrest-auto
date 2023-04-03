const { isPositiveInteger } = require('./');

module.exports = limit => {
 let limitClause = 'LIMIT ';

 if (isPositiveInteger(limit)) {
  limitClause += limit;
 } else if (limit === -1) {
  limitClause += 'ALL';
 } else {
  limitClause += 1000;
 }

 return limitClause;
};
