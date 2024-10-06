const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

class ERPFetch {
 #url = 'https://erprest.iconsjo.space/REST/';
 // #url = 'https://localhost:6130/REST';
 #headers = {
  'Content-Type': 'application/json',
 };
 #query = null;
 #dataField = null;

 constructor(uri, dataField) {
  this.#url += uri;
  this.#dataField = dataField;
  this.#query = '?';
 }

 set query(_query) {
  if (null == _query) this.#query = '?';
  else this.#query += _query;
 }
 get url() {
  return '?' === this.#query ? this.#url + this.#query : this.#url;
 }
 async fetchERP(fetchOptions) {
  const { success, ...rest } = await fetch(this.url, { headers: this.#headers, ...fetchOptions }).then(resp =>
   resp.json()
  );

  if (false === success) throw Error(rest.message);

  return rest[this.#dataField];
 }
}

module.exports = ERPFetch;