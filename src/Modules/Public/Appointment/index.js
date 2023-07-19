const routes = {
 appointment: '/REST/appointment_states',
 state: '/REST/appointments',
};

module.exports = (app, db) => {
 const { appointment, state } = routes;

 require('./Appointment_state')(appointment)(app, db);
 require('./Home')(state)(app, db);
};
