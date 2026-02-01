import { query } from './db';

export const initTables = async () => {
    try {
        await query(`
            CREATE TABLE IF NOT EXISTS teachers (
                id VARCHAR(6) PRIMARY KEY,
                name VARCHAR(150) NOT NULL,
                department VARCHAR(50) NOT NULL,
                picture VARCHAR(255) NOT NULL
            )
        `);
        console.log('Teachers table initialized');
    } catch (error) {
        console.error('Error initializing teachers table:', error);
    }
};
