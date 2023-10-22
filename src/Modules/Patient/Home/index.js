module.exports =
 ({ idnum, patients, pcontactInfo, newPatiant }) =>
 app => {
  require('./Read')({ idnum, patients, pcontactInfo })(app);
  require('./Create')({ patients, newPatiant })(app);
  require('./Update')(patients)(app);
  require('./Delete')(patients)(app);
 };
