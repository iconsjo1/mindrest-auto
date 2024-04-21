const routes = {
 appointment: { appointment: '/REST/appointments', appointmentMark: '/REST/mark-appointments' },
 state: '/REST/appointment_states',
};

module.exports = app => {
 const { appointment, state } = routes;

 require('./Home-Common')(appointment.appointment)(app);
 require('./Appointment_state')(state)(app);

 if (true === app.audit) require('./Home-audited')(appointment)(app);
 else require('./Home')(appointment)(app);
};
