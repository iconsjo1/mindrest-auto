module.exports = app => {
 const route = '/REST/doctor_meetings';
 const meeting_columns_med = (_, res, next) => {
  res.locals.meeting_columns = [
   'id',
   'requester_id',
   'doctor_ids',
   'meeting_date',
   'meeting_start',
   'meeting_slots',
   'UPPER(meeting_range) "end"',
   'note'
  ];
  next();
 };

 app.post(route, meeting_columns_med);
 app.put(route, meeting_columns_med);
 app.delete(route, meeting_columns_med);

 require('./Read')(route)(app);
 require('./Create')(route)(app);
 require('./Update')(route)(app);
 require('./Delete')(route)(app);
};
