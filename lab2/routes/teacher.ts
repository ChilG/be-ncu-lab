import express, { Request, Response } from 'express';
import { query } from '../connection/db';
import { ResultSetHeader } from 'mysql2';

import { z } from 'zod';

const router = express.Router();

const TeacherSchema = z.object({
    id: z.string().max(6),
    name: z.string().max(150),
    department: z.string().max(50),
    picture: z.string().url(),
    username: z.string().max(50),
    password: z.string().min(1).max(255)
});

const TeacherUpdateSchema = z.object({
    name: z.string().max(150),
    department: z.string().max(50),
    picture: z.string().url(),
    username: z.string().max(50),
    password: z.string().min(1).max(255)
});

router.get('/', async (req: Request, res: Response) => {
    try {
        const teachers = await query('SELECT * FROM teachers');
        res.json({ data: teachers });
    } catch (error) {
        console.error('Error fetching teachers:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/', async (req: Request, res: Response) => {
    try {
        const validation = TeacherSchema.safeParse(req.body);

        if (!validation.success) {
            res.status(400).json({ error: validation.error.format() });
            return;
        }

        const { id, name, department, picture, username, password } = validation.data;

        await query(
            'INSERT INTO teachers (id, name, department, picture, username, password) VALUES (?, ?, ?, ?, ?, ?)',
            [id, name, department, picture, username, password]
        );

        res.status(201).json({
            id,
            name,
            department,
            picture,
            username
        });
    } catch (error: any) {
        console.error('Error creating teacher:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(409).json({ error: 'Teacher with this ID already exists' });
            return;
        }
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.put('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const validation = TeacherUpdateSchema.safeParse(req.body);

        if (!validation.success) {
            res.status(400).json({ error: validation.error.format() });
            return;
        }

        const { name, department, picture, username, password } = validation.data;

        const result = await query(
            'UPDATE teachers SET name = ?, department = ?, picture = ?, username = ?, password = ? WHERE id = ?',
            [name, department, picture, username, password, id]
        ) as ResultSetHeader;

        if (result.affectedRows === 0) {
            res.status(404).json({ error: 'Teacher not found' });
            return;
        }

        res.json({ id, name, department, picture, username });
    } catch (error) {
        console.error('Error updating teacher:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await query('DELETE FROM teachers WHERE id = ?', [id]) as ResultSetHeader;

        if (result.affectedRows === 0) {
            res.status(404).json({ error: 'Teacher not found' });
            return;
        }

        res.status(204).send();
    } catch (error) {
        console.error('Error deleting teacher:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/login', async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            res.status(400).json({ error: 'Username and password are required' });
            return;
        }

        const teachers = await query(
            'SELECT * FROM teachers WHERE username = ? AND password = ?',
            [username, password]
        ) as any[];

        if (teachers.length === 0) {
            res.status(401).json({ error: 'Invalid username or password' });
            return;
        }

        const teacher = teachers[0];
        // Exclude password from the response
        const { password: _, ...teacherData } = teacher;

        res.json({ message: 'Login successful', data: teacherData });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;
