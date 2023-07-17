module.exports = obj =>
 'object' === typeof obj &&
 null != obj &&
 0 < Object.keys(obj).length &&
 !Object.values(obj).every(e => null == e);
