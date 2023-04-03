module.exports = (app, db) => {
 require('./form')(app, db);
 require('./formDetails')(app, db);
};
