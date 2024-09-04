module.exports = app => {
 const { all, markDepartment } = { all: '/REST/departments', markDepartment: '/REST/mark-departments' };

 require('./common')(all)(app);

 if (true === app.audit) require('./audit')({ all, markDepartment })(app);
 else require('./no-audit')({ all, markDepartment })(app);
};
