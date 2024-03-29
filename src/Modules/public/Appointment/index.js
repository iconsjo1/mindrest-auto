const routes = {
 appointment: '/REST/appointment_states',
 state: '/REST/appointments',
};

module.exports = app => {
 const { appointment, state } = routes;

 require('./Appointment_state')(appointment)(app);
 require('./Home')(state)(app);
};
