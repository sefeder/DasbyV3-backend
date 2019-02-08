require('dotenv').config()
const mysql = require('mysql2');
 

var pool = mysql.createPool({
  host: process.env.HOST || 'localhost',
  user: process.env.DBUSER,
  database: process.env.DATABASE,
  password: process.env.DBPASS,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;