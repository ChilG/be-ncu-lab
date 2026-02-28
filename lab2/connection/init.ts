import { query } from './db';

export const initTables = async () => {
    try {
        await query(`
            CREATE TABLE IF NOT EXISTS teachers (
                id VARCHAR(6) PRIMARY KEY,
                name VARCHAR(150) NOT NULL,
                department VARCHAR(50) NOT NULL,
                picture VARCHAR(255) NOT NULL,
                username VARCHAR(50) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL
            )
        `);
        
        try {
            await query(`
                ALTER TABLE teachers 
                ADD COLUMN username VARCHAR(50) UNIQUE NOT NULL,
                ADD COLUMN password VARCHAR(255) NOT NULL
            `);
            console.log('Added username and password to teachers table');
        } catch (alterError: any) {
            if (alterError.code !== 'ER_DUP_FIELDNAME') {
                console.error('Error adding columns to teachers table:', alterError.message);
            }
        }
        
        console.log('Teachers table initialized');
    } catch (error) {
        console.error('Error initializing teachers table:', error);
    }
};
