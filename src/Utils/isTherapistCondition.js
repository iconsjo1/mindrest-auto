const { isPositiveInteger, isEString } = require('.');
module.exports = val => {
 if (!isEString(val)) return { msg: '', condition: '1=1' };

 return null == val
  ? { msg: 'All ', condition: '1=1' }
  : isPositiveInteger(val) && 1 === +val
    ? { msg: 'Therapist ', condition: 'is_therapist = TRUE' }
    : { msg: '', condition: 'is_therapist = FALSE' };
};
