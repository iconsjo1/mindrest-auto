module.exports = (app, db) => {
 require('./Public')(app, db);
 require('./NACL')(app, db);
};
