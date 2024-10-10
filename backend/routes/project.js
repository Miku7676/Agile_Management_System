const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    console.log('Token:', token); // Log the token for debugging
    
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
router.post('/', verifyToken, (req, res) => {
  console.log('POST request to create project received:', req.body);
  const { name, scrumMaster } = req.body;
  const db = req.app.get('db');

  if (!name || !scrumMaster) {
    console.log('Missing required fields');
    return res.status(400).json({ error: 'Project name and Scrum Master ID are required' });
  }

  // Generate a random 4-digit group ID
  const projectId = Math.floor(1000 + Math.random() * 9000);

  // Insert project into the database
  const query = 'INSERT INTO `project` (PROJECT_ID, NAME, SCRUM_MASTER) VALUES (?, ?, ?)';
  
  console.log('Executing query:', query, [projectId, name, scrumMaster]);
  db.query(query, [projectId, name, scrumMaster], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to create project' });
    }
    console.log('Project created successfully:', result);
    
    // Add the creator to the project_works_on table
    const addCreatorQuery = 'INSERT INTO `project_works_on` (USER_ID, PROJECT_ID) VALUES (?, ?)';
    db.query(addCreatorQuery, [req.userId, projectId, 'Scrum Master'], (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to add creator to project' });
      }
      // Respond with a success message and the project ID
      res.status(201).json({ message: 'Project created successfully', projectId });
    });
  });
});

// Join an existing project
router.post('/join', verifyToken, (req, res) => {
    console.log('POST request to join project received:', req.body);
    const { projectId } = req.body;
    const userId = req.userId;
    const db = req.app.get('db');
  
    if (!projectId) {
      console.log('Missing required fields');
      return res.status(400).json({ error: 'Project ID is required' });
    }
  
    // Check if the project exists
    const checkProjectQuery = 'SELECT * FROM `project` WHERE PROJECT_ID = ?';
    db.query(checkProjectQuery, [projectId], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to check project existence' });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ error: 'Project not found' });
      }
  
      // Check if the user is already a member of the project
      const checkMembershipQuery = 'SELECT * FROM `project_works_on` WHERE USER_ID = ? AND PROJECT_ID = ?';
      db.query(checkMembershipQuery, [userId, projectId], (err, membershipResults) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Failed to check membership' });
        }
  
        // If user is already a member, return the user list and Scrum Master info
        if (membershipResults.length > 0) {
          const membersQuery = `
            SELECT u.USER_ID, u.USERNAME
            FROM USER u 
            JOIN PROJECT_WORKS_ON pwo ON u.USER_ID = pwo.USER_ID 
            WHERE pwo.PROJECT_ID = ?
          `;
          
          // Get project members
          db.query(membersQuery, [projectId], (err, memberResults) => {
            if (err) {
              console.error('Database error:', err);
              return res.status(500).json({ error: 'Failed to fetch project members' });
            }
  
            // Get Scrum Master information
            const scrumMasterQuery = 'SELECT SCRUM_MASTER FROM `project` WHERE PROJECT_ID = ?';
            db.query(scrumMasterQuery, [projectId], (err, scrumMasterResults) => {
              if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Failed to fetch Scrum Master' });
              }
  
              if (scrumMasterResults.length > 0) {
                const scrumMasterId = scrumMasterResults[0].SCRUM_MASTER;
                res.status(200).json({ message: 'User is already a member of this project', members: memberResults, scrumMasterId });
              } else {
                res.status(200).json({ message: 'User is already a member of this project', members: memberResults });
              }
            });
          });
        } else {
          // Add the user to the project_works_on table
          const joinProjectQuery = 'INSERT INTO `project_works_on` (USER_ID, PROJECT_ID) VALUES (?, ?)';
          db.query(joinProjectQuery, [userId, projectId], (err, result) => {
            if (err) {
              console.error('Database error:', err);
              return res.status(500).json({ error: 'Failed to join project' });
            }
            res.status(200).json({ message: 'Successfully joined project', projectId });
          });
        }
      });
    });
  });
  
// Get a specific project by ID
router.get('/:projectId', verifyToken, (req, res) => {
    console.log('GET request for project received. Project ID:', req.params.projectId);
    const db = req.app.get('db');
    const projectId = req.params.projectId;
  
    // Query to get project details
    const projectQuery = 'SELECT * FROM `project` WHERE PROJECT_ID = ?';
    
    // Query to get project members
    const membersQuery = `
      SELECT u.USER_ID, u.USERNAME
      FROM USER u 
      JOIN PROJECT_WORKS_ON pwo ON u.USER_ID = pwo.USER_ID 
      WHERE pwo.PROJECT_ID = ?
    `;
  
    console.log('Executing project query:', projectQuery, [projectId]);
    db.query(projectQuery, [projectId], (err, projectResults) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to fetch project details' });
      }
  
      console.log('Project query results:', projectResults);
  
      if (projectResults.length === 0) {
        console.log('Project not found');
        return res.status(404).json({ error: 'Project not found' });
      }
  
      const project = projectResults[0];
  
      console.log('Executing members query:', membersQuery, [projectId]);
      db.query(membersQuery, [projectId], (err, memberResults) => {
        if (err) {
          console.error('Database error while fetching members:', err);
          return res.status(500).json({ error: 'Failed to fetch project members' });
        }
  
        console.log('Members query results:', memberResults);
  
        project.members = memberResults;
        console.log('Sending response:', project);
        res.json(project);
      });
    });
  });
  

module.exports = router;