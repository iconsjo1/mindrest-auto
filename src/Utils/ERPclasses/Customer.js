const ERPFetch = require('./ERPFetch');

class Customer extends ERPFetch {
 #territory = null;
 #ref = null;

 constructor(customer_ref) {
  super('customers', 'cust_data');
  this.#ref = customer_ref;
 }

 set territory(country_id) {
  const COUNTRIES = {
   JORDAN: 111,
   SAUDI: 190,
  };

  switch (parseInt(country_id, 10)) {
   case COUNTRIES.JORDAN:
    this.#territory = 'Jordan';
    break;

   case COUNTRIES.SAUDI:
    this.#territory = 'Saudi Arabia';
    break;

   default:
    this.#territory = 'Rest Of The World';
  }
 }

 async safeCreateERP(country_id) {
  try {
   await this.readERP();
   this.query = null;
  } catch {
   this.territory = country_id;

   await super.fetchERP({
    method: 'POST',
    body: JSON.stringify({
     customer_ref: this.#ref,
     customer_type: 'Individual',
     customer_group: 'Individual',
     territory: this.#territory,
    }),
   });
  }
 }
 readERP() {
  this.query = 'customer_ref=' + this.#ref;
  return super.fetchERP({ method: 'GET' });
 }
}
module.exports = Customer;
