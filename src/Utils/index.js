const EMPTY_ALLOWED = true;
const NO_EMPTY_ALLOWED = false;

module.exports = {
 isPositiveInteger: val => require('./positiveIntegerCheck')(val),
 getLimitClause: limit => require('./getLimitClause')(limit),
 isValidObject: val => require('./objectCheck')(val),
 isString: val => require('./checkString')(val)(NO_EMPTY_ALLOWED),
 isEString: val => require('./checkString')(val)(EMPTY_ALLOWED),
 isPositiveNumber: val => require('./checkPositiveNumber')(val),
 isIterable: val => require('./itrableCheck')(val),
 orderBy: fieldName => require('./orderBy')(fieldName),
 isSQLDate: dateStr => require('./isSQLDate')(dateStr),
 isMilitarytime: time => require('./militaryTimeCheck')(time),
 isTherapist: val => require('./isTherapistCondition')(val),
 rollback: async (savepoint, db) => await require('./rollback')(savepoint, db),
 ROLES: val => require('./rules'),
};
