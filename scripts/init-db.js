// Creates the database and tables from database/schema.sql. Never drops data.
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

(async () => {
  const sql = fs.readFileSync(path.join(__dirname, '..', 'database', 'schema.sql'), 'utf8')
    .replace(/infoverse/g, process.env.DB_NAME || 'infoverse');
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST, port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER, password: process.env.DB_PASSWORD, multipleStatements: true,
  });
  await conn.query(sql);
  await conn.end();
  console.log('Database ready.');
})().catch((e) => { console.error('Database setup failed:', e.message); process.exit(1); });
