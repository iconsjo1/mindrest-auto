const { isString } = require('.');

module.exports = fieldName => {
 const upperOrder = process.env.DB_DEFAUT_ORDER.toUpperCase();
 return (
  'ORDER BY ' +
  (isString(fieldName) ? fieldName : 1) +
  ' ' +
  (/^DESC$/.test(upperOrder) ? upperOrder : '')
 );
};
