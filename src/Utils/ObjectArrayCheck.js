module.exports = (arr, everycb) => mayEmpty => {
 if ('function' !== typeof everycb) return false;

 if (true === mayEmpty && (null == arr || 0 === arr?.length)) return true;

 return Array.isArray(arr) && 0 < arr.length && arr.every(everycb);
};
