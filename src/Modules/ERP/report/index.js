module.exports = app => {
 const route = '/REST/sell_invoice';

 require('./sell_invoice')(route)(app);
};
