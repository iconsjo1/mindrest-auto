const { isPositiveInteger, isEString } = require('.');
module.exports = val => {
 if (!isEString(val)) throw new Error('Invalid is_therapist value');

 return null == val
  ? { msg: 'All ', condition: '1=1' }
  : isPositiveInteger(val) && 1 === +val
  ? { msg: 'Therapist ', condition: 'TRUE = is_therapist' }
  : { msg: '', condition: 'FALSE = is_therapist' };
};
