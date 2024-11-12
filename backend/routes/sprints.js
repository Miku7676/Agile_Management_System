const express = require('express');
const router = express.Router({ mergeParams: true });
const jwt = require('jsonwebtoken');
const db = require('../db');

// Reuse the same verifyToken middleware from project.js
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    
    if (!token) {
      return res.status(403).json({ error: 'No token provided' });
    }
  
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      req.userId = decoded.userId;
      next();
    });
};

// Get all sprints for a specific project
router.get('/', verifyToken, (req, res) => {
  const projectId = req.params.projectId;

  const query = `
    SELECT 
      s.SPRINT_ID,
      s.NAME,
      s.START_DT,
      s.END_DT,
      s.PROJECT_ID,
      s.Description
    FROM sprint s
    WHERE s.PROJECT_ID = ?
  `;

  db.query(query, [projectId], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to fetch sprints' });
    }
    res.status(200).json(results);
  });
});

// Create a new sprint
router.post('/create', verifyToken, (req, res) => {
  const projectId = req.params.project_Id;
  const userId = req.userId;
  const { name, startDate, endDate,desc } = req.body;

  // Validation
  if (!name || !startDate || !endDate || !projectId) {
    console.log('Missing required fields');
    return res.status(400).json({ 
      error: 'Sprint name, start date, end date, and project ID are required' 
    });
  }

  // Validate date format and logic
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return res.status(400).json({ error: 'Invalid date format' });
  }

  if (end <= start) {
    return res.status(400).json({ error: 'End date must be after start date' });
  }


  const insertQuery = `
    call createSprint(?,?,?,?,?,?)
  `;

  db.query(insertQuery, [userId, projectId, startDate, endDate, name, desc], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      if (err.errno === 1452) {
        return res.status(404).json({ error: 'Project does not exist' });
      }
      return res.status(500).json({ error: 'Failed to create sprint' });
    }

    console.log('Sprint created successfully');
    console.log(result);
    res.status(201).json({ 
      message: 'Sprint created successfully',
      sprintId: result.insertId,
      name,
      startDate,
      endDate,
      projectId
    });
  });
});


// fetch all the sprint details
router.get('/:sprintId', verifyToken, (req, res) => {
  const sprintId = req.params.sprintId;
  const query = `
      call fetch_sprintTasks(?);
    `;


  db.query(query,[sprintId], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to fetch sprints' });
    }
    res.status(200).json(results.slice(0,-1));
  });
});

router.use('/:sprintId/task', require('./tasks'));

module.exports = router;