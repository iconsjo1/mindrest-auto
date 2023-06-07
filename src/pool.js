const pg = require('pg');

pg.types.setTypeParser(1082, stringValue => stringValue); //1082 for date type
pg.types.setTypeParser(1114, stringValue => stringValue); //1114 for time without timezone type
pg.types.setTypeParser(1186, stringValue => stringValue); //1114 for interval

module.exports = new pg.Pool({
 user: 'mclinic',
 password: '#6c9^s7QtEKdmQ-s',
 host: 'icloudjo.com',
 database: 'mind-clinic',
 port: 5432,
});
