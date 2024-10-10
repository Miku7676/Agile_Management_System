const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all sprints with group (project) and scrum master details
router.get('/', (req, res) => {
  const query = `
    SELECT s.SPRINT_ID, s.NAME as sprint_name, s.START_DT as start_date, s.END_DT as end_date,
           p.PROJECT_ID as group_id, p.NAME as group_name, p.SCRUM_MASTER as scrum_master_id
    FROM sprint s
    JOIN project p ON s.PROJECT_ID = p.PROJECT_ID
  `;

  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});

// Post a new sprint (assuming PROJECT_ID is passed as part of the request)
router.post('/', (req, res) => {
  const { sprint_name, start_date, end_date, project_id } = req.body;
  const query = `
    INSERT INTO sprint (NAME, START_DT, END_DT, PROJECT_ID) 
    VALUES (?, ?, ?, ?)
  `;
  db.query(query, [sprint_name, start_date, end_date, project_id], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.status(201).json({ id: result.insertId, ...req.body });
  });
});

module.exports = router;