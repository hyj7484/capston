const mysql = require('mysql');
const connection = mysql.createConnection({
  host : '54.180.128.151',
  user : 'root',
  password : 'dydwn159',
  database : 'sinzuku',
});

connection.connect();

module.exports = connection;
