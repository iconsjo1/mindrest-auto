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
   create: async (ref, country_id) => {
    const newCustomer = await fetch(baseERPURL + '/customers', {
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
    }).then(resp => resp.json());

    if (false === newCustomer.success) throw Error(newCustomer.message);

    return newCustomer.cust_data;
   },
   read: async ref => {
    const customer = await fetch(`${baseERPURL}/customers?customer_ref=${ref}`).then(resp => resp.json());
    if (false === customer.success) throw Error(customer.message);

    return customer.cust_data;
   },
  },
  SERVICE: {
   create: async ref => {
    const item = await fetch(baseERPURL + '/items', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ item_code: ref, item_group: 'Services' }),
    }).then(resp => resp.json());
    if (false === item.success) throw Error(item.message);

    return item.item_data;
   },
   read: async ref => {
    const item = await fetch(`${baseERPURL}/items?item_name=${ref}`).then(resp => resp.json());
    if (false === item.success) throw Error(item.message);

    return item.item_data;
   },
  },
  INVOICE: {
   create: async (cust, ref, rate) => {
    const newInvoice = await fetch(baseERPURL + '/sales_invoice', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ customer: cust, items: [{ item_code: ref, qty: 1, rate }] }),
    }).then(resp => resp.json());

    if (false === newInvoice.success) throw Error(newInvoice.message);

    const updatedInvoice = await fetch(baseERPURL + '/sales_invoice?invoice_name=' + newinvoice_data.name, {
     method: 'PUT',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ docstatus: 1 }), //submitted
    }).then(resp => resp.json());

    if (false === updatedInvoice.success) throw Error(updatedInvoice.message);

    return updatedInvoice.nvoice_data;
   },
   read: async ref => {
    const invoice = await fetch(`${baseERPURL}/sales_invoice?invoice_name=${ref}`).then(resp => resp.json());

    if (false === invoice.success) throw Error(invoice.message);
    return invoice.invoice_data;
   },
  },
  PAYMENTMODE: {
   create: async (mode, type) => {
    const paymentmode = await fetch(baseERPURL + '/Mode of Payment', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ mode_of_payment: mode, type }),
    }).then(resp => resp.json());

    if (false === paymentmode.success) throw Error(paymentmode.message);

    return paymentmode.paymentmode_data;
   },
   read: async mode => {
    const paymentmode = await fetch(`${baseERPURL}/Mode of Payment?mode_of_payment=${mode}`).then(resp => resp.json());

    if (false === paymentmode.success) throw Error(paymentmode.message);

    return paymentmode.paymentmode_data;
   },
  },
  PAYMENTENTRY: {
   create: async function () {
    const paymentEntry = await fetch(baseERPURL + '/Payment Entry', {
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

    if (false === paymentEntry.success) throw Error(paymentEntry.message);

    return paymentEntry.paymententry_data;
   },
   read: async entry => {
    const entries = await fetch(`${baseERPURL}/Payment Entry'?payment_name=${entry}`).then(resp => resp.json());

    if (false === entries.success) throw Error(entries.message);

    return entries.paymententry_data;
   },
  },
 },
};
