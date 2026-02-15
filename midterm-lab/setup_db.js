const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

async function setupDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'rootpassword',
    });

    await connection.query(
      `CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'se_course_db'}`
    );
    console.log(
      `Database ${process.env.DB_NAME || 'se_course_db'} created or already exists.`
    );

    await connection.end();
  } catch (error) {
    console.error('Error creating database:', error);
  }
}

setupDatabase();
