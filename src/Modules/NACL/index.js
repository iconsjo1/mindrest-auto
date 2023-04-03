module.exports = (app, db) => {
 require('./Group')(app, db);
 require('./Group_Column_Policy')(app, db);
 require('./Group_Table_Policy')(app, db);
 require('./Group_User')(app, db);
 require('./Policy')(app, db);
 require('./Sys_User')(app, db);
 require('./User_Column_Policy')(app, db);
 require('./User_Table_Policy')(app, db);
};
