const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  db.query('SELECT * FROM sprints', (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});

router.post('/', (req, res) => {
  const { sprint_name, start_date, end_date } = req.body;
  db.query(
    'INSERT INTO sprints (sprint_name, start_date, end_date) VALUES (?, ?, ?)',
    [sprint_name, start_date, end_date],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json({ id: result.insertId, ...req.body });
    }
  );
});

// Add more routes for updating and deleting sprints

module.exports = router;