import express, { Request, Response } from 'express';
import { query } from '../connection/db';
import { ResultSetHeader } from 'mysql2';

import { z } from 'zod';

const router = express.Router();

const TeacherSchema = z.object({
    id: z.string().max(6),
    name: z.string().max(150),
    department: z.string().max(50),
    picture: z.string().url()
});

const TeacherUpdateSchema = z.object({
    name: z.string().max(150),
    department: z.string().max(50),
    picture: z.string().url()
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

        const { id, name, department, picture } = validation.data;

        await query(
            'INSERT INTO teachers (id, name, department, picture) VALUES (?, ?, ?, ?)',
            [id, name, department, picture]
        );

        res.status(201).json({
            id,
            name,
            department,
            picture
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

        const { name, department, picture } = validation.data;

        const result = await query(
            'UPDATE teachers SET name = ?, department = ?, picture = ? WHERE id = ?',
            [name, department, picture, id]
        ) as ResultSetHeader;

        if (result.affectedRows === 0) {
            res.status(404).json({ error: 'Teacher not found' });
            return;
        }

        res.json({ id, name, department, picture });
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

export default router;
