module.exports =
 ({ all, markEcontact }) =>
 app => {
  require('./Create')(all)(app);
  require('./Patch')(markEcontact)(app);
  require('./Update')(all)(app);
 };
