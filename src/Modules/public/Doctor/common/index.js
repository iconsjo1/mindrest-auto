module.exports =
 ({ all, contact_info, doctor_patients }) =>
 app => {
  require('./Read')({ all, contact_info, doctor_patients })(app);
  require('./Delete')(all)(app);
 };
