module.exports =
 ({ form, details }) =>
 (app, db) => {
  require('./form')(form)(app, db);
  require('./formDetails')(details)(app, db);
 };
