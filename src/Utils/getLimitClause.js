const { isPositiveInteger } = require('./');

module.exports = limit => {
 let limitClause = 'LIMIT ';

 if (isPositiveInteger(limit)) limitClause += limit;
 else if (-1 === limit) limitClause += 'ALL';
 else limitClause += 1000;

 return limitClause;
};
