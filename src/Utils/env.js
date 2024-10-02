const baseERPURL = 'https://erprest.iconsjo.space/REST';
// const baseERPURL = 'https://localhost:6130/REST';
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const COUNTRIES = {
 JORDAN: 111,
 SAUDI: 190,
};

module.exports = {
 FUNCTIONALAUDIT: true,
 APPPORT: 5040,
 DBCONNECTIONS: {
  MAIN: {
   USER: 'mclinic',
   PASSWORD: '^bC7fUe^yS3O*v@P',
   HOST: 'uranus.iconsjo.space',
   DATABASE: 'mind-clinic_dev',
   PORT: 5432,
   MAX: 30,
  },
 },
 ROLES: {
  SUPERADMIN: 5,
  DOCTOR: 6,
  THERAPIST: 7,
  ADMINISTRATION: 26,
  PATIENT: 14,
 },
 TELLER: { QUERY: `SELECT NEXTVAL('story."SQ_Tellers"')` },
 EVENT: {
  TYPE: {
   INSERT: 1,
   UPDATE: 2,
   DELETE: 3,
   LOGIN: 4,
   LOGOUT: 5,
  },
  COLUMNS: ['teller', 'user_id', 'event_type_id'],
  ENC: ['$1', '$2', '$3'],
 },
 ERP: {
  CUSTOMER: {
   create: (ref, country_id) =>
    fetch(baseERPURL + '/customers', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
      customer_ref: ref,
      customer_type: 'Individual',
      customer_group: 'Individual',
      territory:
       country_id === COUNTRIES.JORDAN
        ? 'Jordan'
        : country_id === COUNTRIES.SAUDI
          ? 'Saudi Arabia'
          : 'Rest Of The World',
     }),
    }).then(resp => resp.json()),
   read: ref => fetch(`${baseERPURL}/customers?customer_ref=${ref}`).then(resp => resp.json()),
  },
  SERVICE: {
   create: ref =>
    fetch(baseERPURL + '/items', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ item_code: ref, item_group: 'Services' }),
    }).then(resp => resp.json()),
   read: ref => fetch(`${baseERPURL}/items?item_name=${ref}`).then(resp => resp.json()),
  },
  INVOICE: {
   create: async (cust, ref, rate) => {
    const { success: newSuccess, invoice_data: newinvoice_data } = await fetch(baseERPURL + '/sales_invoice', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ customer: cust, items: [{ item_code: ref, qty: 1, rate }] }),
    }).then(resp => resp.json());

    if (false === newSuccess) throw Error(newinvoice_data.message);
    if ('exc_type' in newinvoice_data)
     throw Error(
      'exception' in newinvoice_data
       ? newinvoice_data.exception
       : 'string' === typeof newinvoice_data._server_messages
         ? JSON.parse(newinvoice_data._server_messages)[0].message
         : newinvoice_data._server_messages[0].message
     );

    const { success, invoice_data } = await fetch(baseERPURL + '/sales_invoice?invoice_name=' + newinvoice_data.name, {
     method: 'PUT',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ docstatus: 1 }), //submitted
    }).then(resp => resp.json());

    if (false === success) throw Error(invoice_data.message);

    if ('exc_type' in invoice_data)
     throw Error(
      'exception' in invoice_data
       ? invoice_data.exception
       : 'string' === typeof invoice_data._server_messages
         ? JSON.parse(invoice_data._server_messages)[0].message
         : invoice_data._server_messages[0].message
     );

    return invoice_data;
   },
   read: ref => fetch(`${baseERPURL}/sales_invoice?invoice_name=${ref}`).then(resp => resp.json()),
  },
  PAYMENTMODE: {
   create: (mode, type) =>
    fetch(baseERPURL + '/Mode of Payment', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ mode_of_payment: mode, type }),
    }).then(resp => resp.json()),
   read: mode => fetch(`${baseERPURL}/Mode of Payment?mode_of_payment=${mode}`).then(resp => resp.json()),
  },
  PAYMENTENTRY: {
   create: function () {
    return fetch(baseERPURL + '/Payment Entry', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
      mode_of_payment: this.mode,
      party_type: 'Customer',
      party: this.customer,
      paid_amount: this.amount,
      received_amount: this.amount,
      paid_to: this.account,
      docstatus: 1,
      custom_package_name: 'test package custom',
      references: [
       {
        reference_name: this.invoice_ref,
        reference_doctype: 'Sales Invoice',
        total_amount: this.amount,
        outstanding_amount: this.amount,
        allocated_amount: this.amount,
       },
      ],
     }),
    }).then(resp => resp.json());
   },
   read: mode => fetch(`${baseERPURL}/Mode of Payment?mode_of_payment=${mode}`).then(resp => resp.json()),
  },
 },
};
