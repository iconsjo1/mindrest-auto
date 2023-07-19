module.exports =
 ({ edit, report }) =>
 app => {
  require('./edit')(edit)(app);
  require('./report')(report)(app);
 };
