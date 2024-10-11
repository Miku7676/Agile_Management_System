const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../db');

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    console.log('Token ik:', token); // Log the token for debugging
    
    if (!token) {
      console.log('No token provided');
      return res.status(403).json({ error: 'No token provided' });
    }
  
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error('JWT verification error:', err);
        return res.status(401).json({ error: 'Unauthorized' });
      }
      req.userId = decoded.userId; // Assign user ID from token
      next();
    });
  };
   
  

// Create a new project
router.post('/create', verifyToken, (req, res) => {
  console.log('POST request to create project received:', req.body);
  const { name, scrumMasterId, description } = req.body;
  const projectManager = req.userId;
  let query,value;

  if (!name || !projectManager || !scrumMasterId) {
    console.log('Missing required fields');
    return res.status(400).json({ error: 'Project name, Project Manager ID, scrum master id are required' });
  }

  // Generate a random 4-digit group ID
  const projectId = Math.floor(1000 + Math.random() * 9000); // GOTTA CHANGE THIS

  // Insert project into the database
  if (description){
    query = 'INSERT INTO `project` (PROJECT_ID, NAME, DESCRIPTION, PROJECT_MANAGER, SCRUM_MASTER) VALUES (?, ?, ?, ?, ?)';
    value = [projectId, name, description, projectManager,scrumMasterId]
  }
  else {
    query = 'INSERT INTO `project` (PROJECT_ID, NAME, PROJECT_MANAGER, SCRUM_MASTER) VALUES (?, ?, ?, ?)';
    value = [projectId, name, projectManager,scrumMasterId]
  }
  
  console.log('Executing query:',[projectId, name, projectManager]);
  db.query(query, value, (err, result) => {
    if (err) {
      console.error('Database error:', err.errno);
      if (err.errno == 1452){
        return res.status(406).json({error:'scrum master id does not exist'})
      }
      return res.status(500).json({ error: 'Failed to create project' });
    }
    console.log('Project created successfully:', result);
    
    const addCreatorQuery = 'INSERT INTO `project_works_on` (USER_ID, PROJECT_ID, ROLE) VALUES (?, ?, ?),(?, ?, ?)';
    db.query(addCreatorQuery, [projectManager, projectId, 'Project_Manager', scrumMasterId, projectId, 'Scrum_Master'], (err, result) => {
      if (err) {
        console.log('Database error:', err);
        return res.status(500).json({ error: 'Failed to add creator to project' });
      }
      // Respond with a success message and the project ID
      res.status(201).json({ message: 'Project created successfully', projectId });
    }); 

  });
});


// Get all projects that a user is a part of
router.get('/', verifyToken, (req, res) => {
  const userId = req.userId;
  // const query = `
  //   SELECT 
  //     p.PROJECT_ID, 
  //     p.NAME
  //   FROM 
  //     project p
  //   WHERE 
  //     p.PROJECT_MANAGER = ?;

  // `;
  const query = `
    SELECT
      p.PROJECT_ID,
      p.NAME
    FROM
      project p
    JOIN project_works_on w on p.PROJECT_ID = w.PROJECT_ID
    WHERE w.USER_ID = ?;
  `

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to fetch projects' });
    }
    res.json(results);
  });
});

  


  

module.exports = router;