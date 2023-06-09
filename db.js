/** Database setup for BizTime. */


// db.js file

const { Client } = require('pg');

const DB_URI = (process.env.NODE_ENV === "Test")
? "postgresql:///biztime_test"
: "postgresql:///biztime";

let db = new Client({
    connectionString: DB_URI
})

db.connect();

module.exports = db;

