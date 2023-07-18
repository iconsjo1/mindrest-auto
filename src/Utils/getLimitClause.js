const { isPositiveInteger } = require('./');

module.exports = limit => {
 let limitClause = 'LIMIT ';
 const parsedLimit = parseInt(limit);

 if (isPositiveInteger(parsedLimit)) limitClause += limit;
 else if (-1 === parsedLimit) limitClause += 'ALL';
 else limitClause += 1000;

 return limitClause;
};
