module.exports = app => {
 const routes = { all: '/REST/econtacts', markEcontact: '/REST/mark-econtacts' };

 const { all, markEcontact } = routes;

 require('./common')(all)(app);

 if (true === app.audit) require('./audit')({ all, markEcontact })(app);
 else require('./no-audit')({ all, markEcontact })(app);
};
