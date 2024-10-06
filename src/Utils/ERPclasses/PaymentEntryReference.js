class PaymentEntryReference {
 #reference_name = null;
 #reference_doctype = null;
 #total_amount = null;
 #outstanding_amount = null;
 #allocated_amount = null;

 constructor(invoice_ref, amount) {
  this.#reference_doctype = 'Sales Invoice';
  this.#reference_name = invoice_ref;
  this.#total_amount = amount;
  this.#outstanding_amount = amount;
  this.#allocated_amount = amount;
 }

 toJSON() {
  return {
   reference_name: this.#reference_name,
   reference_doctype: this.#reference_doctype,
   total_amount: this.#total_amount,
   outstanding_amount: this.#outstanding_amount,
   allocated_amount: this.#allocated_amount,
  };
 }
}

module.exports = PaymentEntryReference;
