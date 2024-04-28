module.exports =
 ({ idnum, patients, pcontactInfo }) =>
 app => {
  require('./Read')({ idnum, patients, pcontactInfo })(app);
  require('./Delete')(patients)(app);
 };
