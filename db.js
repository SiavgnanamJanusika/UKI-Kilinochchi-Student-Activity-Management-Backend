const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const connectDB = async () => {
  try {
    const conn = await pool.getConnection();
    console.log(`MySQL Connected: ${process.env.DB_HOST}`);
    conn.release();
  } catch (error) {
    console.error(' MySQL Connection Failed:', error.message);
    process.exit(1);
  }
};

module.exports = { pool, connectDB };