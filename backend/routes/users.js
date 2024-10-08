const express = require('express');
const router = express.Router();
const db = require('../db');
const jwt = require('jsonwebtoken'); // Ensure you have jsonwebtoken for JWT
require('dotenv').config(); // Load environment variables

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // Define your JWT secret

// Fetch all members
router.get('/', (req, res) => {
  db.query('SELECT * FROM user', (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});

// Login route
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Fetch the user by email
  db.query('SELECT * FROM user WHERE email = ?', [email], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length === 0) {

      return res.status(401).json({ error: 'Invalid email or password'});
    }
    
    const user = results[0];

    // Compare the plain password
    if (password !== user.PASSWORD) {
      return res.status(401).json({ error: `Invalid email or password` });
    }

    // Generate a JWT token if login is successful
    const token = jwt.sign(
      { userId: user.userid},
      JWT_SECRET,
      { expiresIn: '1h' } // Token valid for 1 hour
    );

    res.status(200).json({ message: 'Login successful', token });
  });
});

// Signup route
router.post('/signup', (req, res) => {
  const { userid, username, email, password} = req.body; // Make sure you receive userid from the frontend

  // Ensure all fields are provided
  if (!userid || !username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Insert user into the database without hashing the password
  db.query(
    'INSERT INTO user (user_id, username, email, password) VALUES (?, ?, ?, ?)', // Make sure the column names match your database schema
    [userid, username, email, password], // Use the plain password
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      // Return the new user data with the inserted ID
      res.status(201).json({ userid, username, email});
    }
  );
});

module.exports = router;
