const mysql = require('mysql2/promise');
mysql.createConnection({
  host: '127.0.0.1', 
  user: 'root', 
  password: '', 
  database: 'margyaan_db', 
  port: 3307
}).then(async (conn) => {
  await conn.execute('DELETE FROM ap_users WHERE username="test@gmail.com"');
  console.log('Test user deleted');
  process.exit(0);
});
