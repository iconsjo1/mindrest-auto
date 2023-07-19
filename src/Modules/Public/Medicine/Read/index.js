module.exports =
 ({ medicine, mtf }) =>
 app => {
  require('./Medicine_to_Food')(mtf)(app);
  require('./Read')(medicine)(app);
 };
