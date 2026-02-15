import express, { Request, Response } from 'express';
import path from 'path';
import teacherRouter from './routes/teacher';
import uploadRouter from './routes/upload';
import { initTables } from './connection/init';

const app = express();
const port = 3000;


app.use(express.json());

app.use('/public', express.static(path.join(process.cwd(), 'public')));

app.use('/teacher', teacherRouter);
app.use('/upload', uploadRouter);

app.get('/', (req: Request, res: Response) => {
    res.send('Hello! Mr.Goe');
});

initTables();

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
