const { isString } = require('.');

module.exports = async (savepoint, db) => {
 try {
  if (!isString(savepoint)) throw new Error('Savepoint must be a string');
  await db.query('ROLLBACK TO SAVEPOINT ' + savepoint);
 } catch ({ message }) {
  throw new Error(message);
 }
};
