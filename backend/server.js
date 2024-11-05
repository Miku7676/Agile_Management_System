const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
// const session = require('express-session');
// const passport = require('passport');
require('dotenv').config();

const app = express();
const port = process.env.DB_PORT || 5000;

// Initialize passport config
// require('./config/passport');

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // your frontend URL
  credentials: true // required for cookies, authorization headers with HTTPS
}));
app.use(bodyParser.json());

// Session configuration - must come before passport.initialize()
// app.use(session({
//   secret: process.env.JWT_SECRET,
//   resave: false,
//   saveUninitialized: false,
//   cookie: {
//     secure: process.env.NODE_ENV === 'production', // true in production
//     maxAge: 24 * 60 * 60 * 1000 // 24 hours
//   }
// }));

// Passport middleware
// app.use(passport.initialize());
// app.use(passport.session());

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

// Make db accessible to our router
app.set('db', db);

// Routes
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/sprints', require('./routes/sprints'));
app.use('/api/project', require('./routes/project'));
app.use('/api/users', require('./routes/users'));

// Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send('Something broke!');
// });

// Catch-all route handler for any requests to an unknown route
app.use((req, res) => {
  res.status(404).send('Route not found');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Graceful shutdown handler
// process.on('SIGTERM', () => {
//   db.end(() => {
//     console.log('Database connection closed.');
//     process.exit(0);
//   });
// });