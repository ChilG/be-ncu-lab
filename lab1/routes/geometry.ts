import express, { Request, Response } from 'express';

const router = express.Router();

router.get('/rectangle', (req: Request, res: Response) => {
    const width = parseFloat(req.query.width as string);
    const height = parseFloat(req.query.height as string);

    if (isNaN(width) || isNaN(height)) {
        res.status(400).send('Invalid width or height');
        return;
    }

    const area = width * height;
    res.json({ area });
});

router.get('/circle', (req: Request, res: Response) => {
    const radius = parseFloat(req.query.radius as string);

    if (isNaN(radius)) {
        res.status(400).send('Invalid radius');
        return;
    }

    const area = Math.PI * radius * radius;
    res.json({ area });
});

router.get('/triangle', (req: Request, res: Response) => {
    const base = parseFloat(req.query.base as string);
    const height = parseFloat(req.query.height as string);

    if (isNaN(base) || isNaN(height)) {
        res.status(400).send('Invalid base or height');
        return;
    }

    const area = 0.5 * base * height;
    res.json({ area });
});

export default router;
