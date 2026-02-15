const { query } = require('./db');
const mysql = require('mysql2');

const initTables = async () => {
  try {
    await query(`
            CREATE TABLE IF NOT EXISTS online_course (
                course_id INT(11) AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(100) NOT NULL,
                description VARCHAR(200) NOT NULL,
                duration INT(11) NOT NULL,
                lecturer VARCHAR(100) NOT NULL,
                category VARCHAR(10) NOT NULL,
                promote TINYINT(1) NOT NULL DEFAULT 0,
                course_image VARCHAR(20) NOT NULL
            )
        `);
    console.log('online_course table initialized');
  } catch (error) {
    console.error('Error initializing online_course table:', error);
  }
};

module.exports = { initTables };
