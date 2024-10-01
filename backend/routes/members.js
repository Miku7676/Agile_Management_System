const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  db.query('SELECT * FROM MEMBERS', (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});

router.post('/', (req, res) => {
  const { username, email, role } = req.body;
  db.query(
    'INSERT INTO users (username, email, role) VALUES (?, ?, ?)',
    [username, email, role],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json({ id: result.insertId, ...req.body });
    }
  );
});

// Add more routes for updating and deleting users

module.exports = router;