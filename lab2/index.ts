import express, { Request, Response } from 'express';
import teacherRouter from './routes/teacher';
import { initTables } from './connection/init';

const app = express();
const port = 3000;

app.use(express.json());
app.use('/teacher', teacherRouter);

app.get('/', (req: Request, res: Response) => {
    res.send('Hello! Mr.Goe');
});

initTables();

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
