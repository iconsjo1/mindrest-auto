module.exports =
 ({ form, details }) =>
 app => {
  require('./form')(form)(app);
  require('./formDetails')(details)(app);
 };
