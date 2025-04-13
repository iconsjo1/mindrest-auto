const EMPTY_ALLOWED = true;
const NO_EMPTY_ALLOWED = false;
const { FUNCTIONALAUDIT, APPPORT, ROLES, ...env } = require('./env');

module.exports = {
 ROLES,
 APPPORT,
 FUNCTIONALAUDIT,
 env,
 SQLfeatures: require('./SQLfeatures'),
 getLimitClause: limit => require('./getLimitClause')(limit),
 isBool: val => require('./booleanCheck')(val),
 isEObjArray: (arr, everycb) => require('./ObjectArrayCheck')(arr, everycb)(EMPTY_ALLOWED),
 isEString: val => require('./checkString')(val)(EMPTY_ALLOWED),
 isIterable: val => require('./iterableCheck')(val),
 isMilitarytime: time => require('./militaryTimeCheck')(time),
 isObjArray: (arr, everycb) => require('./ObjectArrayCheck')(arr, everycb)(NO_EMPTY_ALLOWED),
 isPositiveInteger: val => require('./positiveIntegerCheck')(val),
 isPositiveNumber: val => require('./checkPositiveNumber')(val),
 isSQLDate: dateStr => require('./isSQLDate')(dateStr),
 isString: val => require('./checkString')(val)(NO_EMPTY_ALLOWED),
 isTherapist: val => require('./isTherapistCondition')(val),
 isValidObject: val => require('./objectCheck')(val),
 orderBy: fieldName => require('./orderBy')(fieldName),
 pgRowMode: (query, values) => require('./rowMode')(query, values),
 route_logger: require('./Route_Logger'),
 toBuffer: stream => require('./StreemToBuffer')(stream),
};
