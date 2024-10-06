const ERPFetch = require('./ERPFetch');

class PaymentMode extends ERPFetch {
 constructor() {
  super('payment_modes', 'paymentmode_data');
 }

 async safeCreateERP(mode, type) {
  try {
   this.query = 'mode_of_payment=' + mode;

   await super.fetchERP({ method: 'GET' });
  } catch {
   this.query = null;
   await super.fetchERP({
    method: 'POST',
    body: JSON.stringify({ mode_of_payment: mode, type }),
   });
  }
 }
 readERP(mode) {
  this.query = 'mode_of_payment=' + mode;
  return super.fetchERP({ method: 'GET' });
 }
}
module.exports = PaymentMode;
