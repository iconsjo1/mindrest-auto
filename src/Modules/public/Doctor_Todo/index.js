module.exports = app => {
 const route = '/REST/doctor_todos';
 const todo_columns_med = (_, res, next) => {
  res.locals.todo_columns = [
   'id',
   'doctor_id',
   'todo',
   'by_date',
   'is_done',
   'CURRENT_DATE > by_date AND NOT IS_DONE overdue',
  ];
  next();
 };

 app.post(route, todo_columns_med);
 app.put(route, todo_columns_med);
 app.delete(route, todo_columns_med);

 require('./Read')(route)(app);
 require('./Create')(route)(app);
 require('./Update')(route)(app);
 require('./Delete')(route)(app);
};
