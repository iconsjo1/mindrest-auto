module.exports = (app, db) => {
 require('./Medicine_to_Food')(app, db);
 require('./Read')(app, db);
};
