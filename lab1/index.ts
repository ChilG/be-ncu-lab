import express, { Request, Response } from 'express';
import geometryRouter from './routes/geometry';

const app = express();
const port = 3000;

app.use('/geometry', geometryRouter);

app.get('/', (req: Request, res: Response) => {
    res.send('Hello! Mr.Goe');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
