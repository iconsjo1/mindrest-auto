const ERPFetch = require('./ERPFetch');

class Bill extends ERPFetch {
 #ref = null;

 constructor(ref) {
  super('sales_invoice', 'invoice_data');
  if (null != ref) this.#ref = ref;
 }

 get ref() {
  return this.#ref;
 }

 async CreateERP(customer, service, rate) {
  this.query = null;

  const { name } = await super.fetchERP({
   method: 'POST',
   body: JSON.stringify({ customer, items: [{ item_code: service, qty: 1, rate }] }),
  });

  this.#ref = name;
  this.query = 'invoice_name=' + name;

  const submittedInvoice = await super.fetchERP({
   method: 'PUT',
   body: JSON.stringify({ docstatus: 1 }), //submitted,
  });
  return submittedInvoice;
 }
 readERP(ref) {
  this.query = 'invoice_name=' + (null == ref ? this.#ref : ref);
  return super.fetchERP({ method: 'GET' });
 }

 static async readManyERP(invoices) {
  return Promise.all(
   invoices.map(Bill.readERP)
  );
 }
}
module.exports = Bill;
