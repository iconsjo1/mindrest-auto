const ERPFetch = require('./ERPFetch');

class Bill extends ERPFetch {
 #ref = null;

 constructor(ref) {
  super('sales_invoice', 'invoice_data');
  if (null != ref) this.#ref = ref;
 }

 async CreateERP(customer, service, rate) {
  this.query = null;

  const { name } = await super.fetchERP('POST', {
   body: JSON.stringify({ customer, items: [{ item_code: service, qty: 1, rate }] }),
  });

  this.#ref = name;
  this.query = 'invoice_name=' + name;

  const submittedInvoice = await super.fetchERP('PUT', {
   body: JSON.stringify({ docstatus: 1 }), //submitted,
  });
  return submittedInvoice;
 }
 readERP() {
  this.query = 'invoice_name=' + this.#ref;

  return super.fetchERP('GET');
 }

 static readManyERP(invoices) {
  return Promise.all(invoices.map(inv => new Bill(inv).readERP()));
 }
}
module.exports = Bill;
