const pg = require('pg');
pg.types.setTypeParser(1082, stringValue => stringValue); //1082 for date type
module.exports = new pg.Pool({
 user: process.env.DB_USER_NANE,
 password: process.env.DB_USER_PASSWORD,
 host: process.env.HOSTING_URL,
 database: process.env.DB_NAME,
 port: process.env.DB_PORT,
});
