const { isString } = require('.');

module.exports = fieldName => {
 const upperOrder = "DESC".toUpperCase();
 return (
  'ORDER BY ' +
  (isString(fieldName) ? fieldName : 1) +
  ' ' +
  (/^DESC$/.test(upperOrder) ? upperOrder : '')
 );
};
