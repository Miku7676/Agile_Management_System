const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  db.query('SELECT * FROM tasks', (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});

router.post('/', (req, res) => {
  const { task_name, status, sprint_id, assigned_to } = req.body;
  db.query(
    'INSERT INTO tasks (task_name, status, sprint_id, assigned_to) VALUES (?, ?, ?, ?)',
    [task_name, status, sprint_id, assigned_to],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json({ id: result.insertId, ...req.body });
    }
  );
});

// Add more routes for updating and deleting tasks

module.exports = router;