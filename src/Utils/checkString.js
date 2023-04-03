module.exports = str => canEmpty => {
 if (!(null == str || 'string' === typeof str)) return false;
 return true === canEmpty || (null != str && 0 < str.length);
};
