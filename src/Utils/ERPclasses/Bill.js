const ERPFetch = require('./ERPFetch');

class Bill extends ERPFetch {
 #ref = null;

 constructor(ref) {
  super('sales_invoice', 'invoice_data');
  if (null != ref) this.#ref = ref;
 }

 get ref() {
  // needed for Post Bill
  return this.#ref;
 }

 async CreateERP(customer, service, rate) {
  const { name } = await super.fetchERP('POST', {
   body: JSON.stringify({
    customer,
    items: [{ item_code: service, qty: 1, rate }],
    allocate_advances_automatically: 1, // connected to first payment entry
   }),
  });

  this.#ref = name;

  const submittedInvoice = await this.queryERP(
   'PUT',
   { docstatus: 1 } //submitted,docstatus
  );

  return submittedInvoice;
 }
 queryERP(method, body) {
  this.query = 'invoice_name=' + this.#ref;

  return super.queryERP(method, body);
 }

 static readManyERP(invoices) {
  return Promise.all(invoices.map(inv => new Bill(inv).queryERP('GET')));
 }
}
module.exports = Bill;
