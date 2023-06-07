const { isString } = require('.');
module.exports = time => {
 if (!isString(time)) return false;
 return /([01]?\d|2[0-3]):([0-5]?\d)/.test(time);
};
