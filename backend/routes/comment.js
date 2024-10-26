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

router.get('/',verifyToken,(req,res) => {
    // const userId = req.userId;
    const {projectId} = req.body;


})

router.post('/postcom', verifyToken, (req, res) => {
    const userId = req.userId;
    const {projectId,content} = req.body;
  
    const query = `
      INSERT INTO COMMENT(USER_ID,PROJECT_ID,CONTENT) VALUES(?,?,?)
    `
  
    db.query(query, [userId,projectId,"ahhahaha"], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to fetch projects' });
      }
      // userid err handle
      res.status(200).send({message:"success"});
    });
  });

module.exports = router;