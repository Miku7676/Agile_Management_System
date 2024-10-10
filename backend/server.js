const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
require("dotenv").config()

const app = express();
const port = process.env.DB_PORT || 5000;
// Middleware
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

// Set the database connection on the app
app.set('db', db);

// Routes
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/sprints', require('./routes/sprints'));
app.use('/api/members', require('./routes/users'));
app.use('/api/project', require('./routes/project'));
app.use('/api/users', require('./routes/users'));



console.log('Registered routes:');
app._router.stack.forEach(function(r){
  if (r.route && r.route.path){
    console.log(r.route.path)
  } else if(r.name === 'router'){
    r.handle.stack.forEach(function(nestedRoute){
      if(nestedRoute.route){
        console.log(r.regexp, nestedRoute.route.path);
      }
    })
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});