const baseERPURL = 'https://erprest.iconsjo.space/REST';
// const baseERPURL = 'https://localhost:6130/REST';
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const headers = {
 Accept: 'application/json',
 'Content-Type': 'application/json',
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
  PAYMENTENTRY: {
   create: async function () {
    const paymentEntry = await fetch(baseERPURL + '/payment_entries', {
     method: 'POST',
     headers,
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
    const entries = await fetch(`${baseERPURL}/payment_entries'?payment_name=${entry}`, { headers }).then(resp =>
     resp.json()
    );

    if (false === entries.success) throw Error(entries.message);

    return entries.paymententry_data;
   },
  },
 },
};
