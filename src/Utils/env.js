const baseERPURL = 'https://erprest.iconsjo.space/REST';

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

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
       country_id === countries.JORDAN
        ? 'Jordan'
        : country_id === countries.SAUDI
          ? 'Saudi Arabia'
          : 'Rest Of The World',
     }),
    }).then(resp => resp.json()),
  },
  SERVICE: {
   create: ref =>
    fetch(baseERPURL + '/items', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ item_code: ref, item_group: 'Services' }),
    }).then(resp => resp.json()),
  },
 },
};
