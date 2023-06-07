module.exports = (app, db) => {
 require('./Appointment')(app, db);
 require('./Bill')(app, db);
 require('./Bill_Service')(app, db);
 require('./City')(app, db);
 require('./Contact')(app, db);
 require('./Country')(app, db);
 require('./currency')(app, db);
 require('./Department')(app, db);
 require('./Deposite_Method')(app, db);
 require('./Doctor')(app, db);
 require('./Doctor_Holiday')(app, db);
 require('./Doctor_Reply')(app, db);
 require('./Doctor_Schedule')(app, db);
 require('./Doctor_Speciality')(app, db);
 require('./Document')(app, db);
 require('./Emergency_Contact')(app, db);
 require('./Expense_Category')(app, db);
 require('./Expense')(app, db);
 require('./Form')(app, db);
 require('./Screen_Group')(app, db);
 require('./Hall')(app, db);
 require('./Holiday')(app, db);
 require('./Lab_Test')(app, db);
 require('./Lab')(app, db);
 require('./Marital_Status')(app, db);
 require('./Medicine')(app, db);
 require('./Patient')(app, db);
 require('./Personnel_Title')(app, db);
 require('./Doctor_Timeout')(app);
 require('./Prescription')(app, db);
 require('./Relationship')(app, db);
 require('./Role')(app, db);
 require('./Role_Screen')(app, db);
 require('./Screen')(app, db);
 require('./Session')(app, db);
 require('./Service')(app, db);
 require('./User')(app, db);
 require('./Vendor')(app, db);
 require('./Visit')(app, db);
 require('./Vital_Sign')(app, db);
};
