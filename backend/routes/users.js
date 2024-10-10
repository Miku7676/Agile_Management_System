const express = require('express');
const router = express.Router();
const db = require('../db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const SALT_ROUNDS = 10; // Define the number of salt rounds for hashing passwords

// Fetch all members
router.get('/', (req, res) => {
  db.query('SELECT * FROM user', (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Login route
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Fetch the user by email
  db.query('SELECT * FROM user WHERE EMAIL = ?', [email], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = results[0];

    // Compare the hashed password
    bcrypt.compare(password, user.PASSWORD, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ error: 'Error comparing passwords' });
      }

      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Generate a JWT token if login is successful
      const token = jwt.sign(
        { userId: user.USER_ID },
        JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.status(200).json({ message: 'Login successful', token });
    });
  });
});

// Signup route
router.post('/signup', (req, res) => {
  const { userid, username, email, password } = req.body;

  if (!userid || !username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Hash the password before inserting into the database
  bcrypt.hash(password, SALT_ROUNDS, (err, hashedPassword) => {
    if (err) {
      return res.status(500).json({ error: 'Error hashing password' });
    }

    // Insert user into the database with the hashed password
    db.query(
      'INSERT INTO user (USER_ID, USERNAME, EMAIL, PASSWORD) VALUES (?, ?, ?, ?)',
      [userid, username, email, hashedPassword],
      (err, result) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        // Optionally, you can return a token after signup
        const token = jwt.sign({ userId: userid }, JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ userid, username, email, token });
      }
    );
  });
});

module.exports = router;
