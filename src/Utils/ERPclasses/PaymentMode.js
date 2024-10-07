const ERPFetch = require('./ERPFetch');

class PaymentMode extends ERPFetch {
 constructor() {
  super('payment_modes', 'paymentmode_data');
 }

 async safeCreateERP(mode, type) {
  try {
   await this.readERP(mode);
   this.query = null;
  } catch {
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
