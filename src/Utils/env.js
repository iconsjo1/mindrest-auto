module.exports = {
 FUNCTIONALAUDIT: true,
 APPPORT: 5040,
 DBCONNECTIONS: {
  MAIN: {
   USER: 'mclinic',
   PASSWORD: '^bC7fUe^yS3O*v@P',
   HOST: 'icloudjo.com',
   DATABASE: 'mind-clinic',
   PORT: 5432,
  },
 },
 ROLES: {
  SUPERADMIN: 5,
  DOCTOR: 6,
  THERAPIST: 7,
  ADMINISTRATION: 26,
  PATIENT: 14,
 },
 STORY: {
  APPOINTMENT: 1,
 },
 TELLER: { COLUMNS: ['user_id', 'table_id'], ENC: ['$1', '$2'] },
 EVENT: {
  TYPE: {
   UPDATE: 1,
   DELETE: 2,
  },
  COLUMNS: ['teller_id', 'user_id', 'event_type_id'],
  ENC: ['$1', '$2', '$3'],
 },
};
