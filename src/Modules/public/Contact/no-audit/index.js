module.exports =
 ({ all, markContacts }) =>
 app => {
  require('./Create')(all)(app);
  require('./Patch')(markContacts)(app);
  require('./Update')(all)(app);
 };
