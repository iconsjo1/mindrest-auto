module.exports = app => {
 const route = '/REST/meetings';
 const meeting_columns_med = (_, res, next) => {
  res.locals.meeting_columns = [
   'id',
   'requester_id',
   'user_ids',
   'meeting_date',
   'meeting_start',
   'meeting_slots',
   'UPPER(meeting_range) "end"',
   'remarks',
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
