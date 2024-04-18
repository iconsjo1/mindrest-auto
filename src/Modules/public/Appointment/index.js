const routes = {
 appointment: '/REST/appointments',
 state: '/REST/appointment_states',
};

module.exports = app => {
 const { appointment, state } = routes;

 require('./Appointment_state')(state)(app);
 if (true === app.audit) require('./Home-audited')(appointment)(app);
 else require('./Home')(appointment)(app);
};
