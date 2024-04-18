const pg = require('pg');

pg.types.setTypeParser(1082, stringValue => stringValue); //1082 for date type
pg.types.setTypeParser(1114, stringValue => stringValue); //1114 for time without timezone type
pg.types.setTypeParser(1186, stringValue => stringValue); //1114 for interval

const {
 DBCONNECTIONS: { MAIN: SELECTEDDB },
} = require('./Utils/env');

module.exports = new pg.Pool({
 user: SELECTEDDB.USER,
 password: SELECTEDDB.PASSWORD,
 host: SELECTEDDB.HOST,
 database: SELECTEDDB.DATABASE,
 port: SELECTEDDB.PORT,
});
