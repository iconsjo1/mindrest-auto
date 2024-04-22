module.exports = app => {
 const route = '/REST/logs';

 require('./Log')(route)(app);
};
