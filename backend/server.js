const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
require("dotenv").config()

const app = express();
const port = process.env.DB_PORT || 5000;

// // Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// // Routes
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/sprints', require('./routes/sprints.js'));
app.use('/api/users', require('./routes/users.js'));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});