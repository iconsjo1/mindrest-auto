module.exports = (app, db) => {
 require('./Appointment_state')('/REST/appointment_states')(app, db);
 require('./Home')('/REST/appointments')(app, db);
};
