module.exports = app => {
 const routes = { all: '/REST/contacts', markContacts: '/REST/mark-contacts' };
 const { all, markContacts } = routes;

 require('./common')(all)(app);

 if (true === app.audit) require('./audit')({ all, markContacts })(app);
 else require('./no-audit')({ all, markContacts })(app);
};
