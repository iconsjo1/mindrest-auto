const { isPositiveInteger, isEString } = require('.');
module.exports = val => {
 if (!isEString(val)) throw new Error('Invalid is_therapist value');

 return null == val
  ? { msg: 'All ', condition: '1=1' }
  : isPositiveInteger(val) && 1 === +val
  ? { msg: 'Therapist ', condition: 'true = is_therapist' }
  : { msg: '', condition: 'false = is_therapist' };
};
