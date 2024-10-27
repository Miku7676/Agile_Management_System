const express = require('express');
const router = express.Router({ mergeParams: true });
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

router.get('/',verifyToken,(req,res) => {
    const userId = req.userId;
    const projectId = req.params.project_Id;

    if (!projectId) {
      return res.status(400).json({ error: 'Project ID is required' });
    }

    const query = `
      CALL fetchComments(?, ?)
    `
  
    db.query(query, [projectId, userId], (err, commentresults) => {
      if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Failed to create comment' });
      }

      if (!commentresults.length > 2){
        console.error("project does not exist")
        return res.status(400).send("Invalid Project Id")
      }


      // console.log(commentresults[0]);
      res.status(201).json({ 
          message: "Comment created successfully",
          result: commentresults[0]
      });
    });

    
})

router.post('/postcom', verifyToken, (req, res) => {
    const userId = req.userId;
    const projectId = req.params.project_Id;
    const {content} = req.body;
    console.log(`this is the proj_id: ${projectId}`)

    if (!projectId) {
      return res.status(400).json({ error: 'Project ID is required' });
    }
    
    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }


    const query = `
      INSERT INTO COMMENT(USER_ID,PROJECT_ID,CONTENT) VALUES(?,?,?)
    `
  
    db.query(query, [userId, projectId, content], (err, results) => {
      if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Failed to create comment' });
      }
      res.status(201).json({ 
          message: "Comment created successfully",
          commentId: results.insertId
      });
    });
  });

module.exports = router;