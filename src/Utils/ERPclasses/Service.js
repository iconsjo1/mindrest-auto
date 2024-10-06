const ERPFetch = require('./ERPFetch');

class Service extends ERPFetch {
 #ref = null;

 constructor(service_ref) {
  super('items', 'item_data');
  this.#ref = service_ref;
 }

 async safeCreateERP() {
  try {
   this.query = 'item_name=' + this.#ref;

   await super.fetchERP({ method: 'GET' });
  } catch {
   this.query = null;

   await super.fetchERP({
    method: 'POST',
    body: JSON.stringify({ item_code: this.#ref, item_group: 'Services' }),
   });
  }
 }
 readERP() {
  this.query = 'item_name=' + this.#ref;
  return super.fetchERP({ method: 'GET' });
 }
}
module.exports = Service;
