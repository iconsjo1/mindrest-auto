module.exports = app => {
 // story
 require('./story')(app);

 // public
 require('./public/User')(app);

 app.use(require('../Utils/Auth'));
 require('./ERP/report')(app);
 [
  'Appointment',
  'Bill',
  'Branches',
  'City',
  'Contact',
  'Country',
  'currency',
  'Department',
  'Deposite_Method',
  'Deposite_Method_Type',
  'Doctor',
  'Doctor_Holiday',
  'Doctor_Meeting',
  'Doctor_Reply',
  'Doctor_Schedule',
  'Doctor_Speciality',
  'Doctor_Timeout',
  'Doctor_Todo',
  'Document',
  'Emergency_Contact',
  'Expense',
  'Expense_Category',
  'Form',
  'Hall',
  'Holiday',
  'Lab',
  'Lab_Test',
  'Marital_Status',
  'Medicine',
  'Patient',
  'Personnel_Title',
  'Prescription',
  'Relationship',
  'Report',
  'Reservation',
  'Role',
  'Role_Screen',
  'Screen',
  'Screen_Group',
  'Service',
  'Session',
  'Vendor',
  'Visit',
  'Vital_Sign',
 ].forEach(r => require('./public/' + r)(app));
};
