module.exports =
 ({ idnum, patients, pcontactInfo }) =>
 app => {
  require('./Read')({ idnum, patients, pcontactInfo })(app);
  require('./Create')(patients)(app);
  require('./Update')(patients)(app);
  require('./Delete')(patients)(app);
 };
