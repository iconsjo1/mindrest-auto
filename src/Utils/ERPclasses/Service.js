const ERPFetch = require('./ERPFetch');

class Service extends ERPFetch {
 #ref = null;

 constructor(service_ref) {
  super('items', 'item_data');
  this.#ref = service_ref;
 }

 async safeCreateERP() {
  try {
   await this.readERP();
   this.query = null;
  } catch {
   await super.fetchERP({
    method: 'POST',
    body: JSON.stringify({ item_code: this.#ref, item_group: 'Services' }),
   });
  }
 }
 readERP() {
  this.query = 'item_name=' + this.#ref;
  return super.queryERP('GET');
 }
}
module.exports = Service;
