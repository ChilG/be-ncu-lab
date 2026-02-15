const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const courseRouter = require('./routes/course');
const { initTables } = require('./connection/init');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/', courseRouter);

app.get('/', (req, res) => {
  res.send('Midterm Lab - API for Online Courses');
});

initTables();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
