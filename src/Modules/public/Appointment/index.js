const routes = {
 appointment: { appointment: '/REST/appointments', appointmentMark: '/REST/mark-appointments' },
 state: '/REST/appointment_states',
};

module.exports = app => {
 const { appointment, state } = routes;

 require('./Appointment_state')(state)(app);

 require('./Home/Common')(appointment.appointment)(app);
 if (true === app.audit) require('./Home/audit')(appointment)(app);
 else require('./Home/no-audit')(appointment)(app);
};
