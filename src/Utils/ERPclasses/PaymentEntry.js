const ERPFetch = require('./ERPFetch');
const PaymentEntryReference = require('./PaymentEntryReference');

class PaymentEntry extends ERPFetch {
 #references = [];
 #account = null;
 #amount = null;
 #method_name = null;
 #customer_ref = null;

 constructor(account, amount, method_name, customer_ref) {
  super('payment_entries', 'paymententry_data');

  this.#account = account;
  this.#amount = amount;
  this.#method_name = method_name;
  this.#customer_ref = customer_ref;
 }

 addReference(invoice_ref) {
  this.#references.push(new PaymentEntryReference(invoice_ref, this.#amount));
 }

 async CreateERP() {
  this.query = null;

  const entry = await super.fetchERP({
   method: 'POST',
   body: JSON.stringify({
    mode_of_payment: this.#method_name,
    party_type: 'Customer',
    party: this.#customer_ref,
    paid_amount: this.#amount,
    received_amount: this.#amount,
    paid_to: this.#account,
    docstatus: 1,
    custom_package_name: 'test package custom',
    references: this.#references.map(r => r.toJSON()),
   }),
  });
  return entry;
 }
 readERP(filters) {
  const queries = [];

  if ('invoice_ref' in filters) queries.push('invoice_ref=' + invoice);

  if ('party' in filters) queries.push('party=' + customer);

  if ('payment_name' in filters) queries.push('payment_name=' + entry);

  this.query = 0 < queries.length ? queries.join('&') : null;
  return super.fetchERP({ method: 'GET' });
 }
}

module.exports = PaymentEntry;
