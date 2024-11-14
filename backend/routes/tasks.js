const express = require('express');
const router = express.Router({ mergeParams: true });
const jwt = require('jsonwebtoken');
const db = require('../db');

// Reuse the same verifyToken middleware
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

// Get all tasks with status information
// router.get('/', verifyToken, (req, res) => {
//   const projectId = req.params.projectId;
//   const sprintId = req.params.sprintId;

//   const query = `
//     SELECT 
//       t.TASK_ID,
//       t.TITLE,
//       t.DESCRIPTION,
//       t.ASSIGNED_TO,
//       t.PROJECT_ID,
//       t.SPRINT_ID,
//       TS.STATUS_ID,
//       TS.NAME as STATUS_NAME,
//     FROM TASK t
//     JOIN TASK_STATUS Ts ON t.STATUS_ID = TS.STATUS_ID
//     WHERE t.PROJECT_ID = ?
//     ${sprintId ? 'AND t.SPRINT_ID = ?' : ''}
//     ORDER BY t.TASK_ID DESC
//   `;

//   const queryParams = sprintId ? [projectId, sprintId] : [projectId];

//   db.query(query, queryParams, (err, results) => {
//     if (err) {
//       console.error('Database error:', err);
//       return res.status(500).json({ error: 'Failed to fetch tasks' });
//     }
//     res.status(200).json(results);
//   });
// });

// Create a new task
router.post('/create', verifyToken, (req, res) => {
  const projectId = req.params.project_Id;
  const sprint_Id = req.params.sprintId;
  console.log(projectId);
  const {
    title,
    description,
    assigned_to,
    sprint_id,
    status_id = 0  // Default to 'in progress' if not specified
  } = req.body;
  console.log(req.body );
  // Validation
  if (!title || !projectId) {
    return res.status(400).json({ 
      error: 'Task title and project ID are required' 
    });
  }

  const createTaskQuery = `
    CALL createTask(?, ?, ?, ?, ?, ?)
  `;

  db.query(
    createTaskQuery,
    [title, description, assigned_to, projectId, sprint_Id, status_id],
    (err, result) => {
      if (err) {
        console.error('Database error:', err);
        if (err.errno === 1452) {
          return res.status(404).json({ error: 'Invalid project, sprint, or status ID' });
        }
        return res.status(500).json({ error: 'Failed to create task' });
      }

      const taskId = result
      res.status(201).json({
        message: 'Task created successfully',
        task: {
          task_id: taskId,
          title,
          description,
          assigned_to,
          project_id: projectId,
          sprint_id,
          status_id,
          is_completed: status_id === 1
        }
      });
    }
  );
});
router.post('/delete', verifyToken, (req, res) => {
  const projectId = req.params.project_Id;
  const sprint_Id = req.params.sprintId;
  const {taskId} = req.body
  console.log(taskId);
  // Validation
  if (!taskId) {
    return res.status(400).json({ 
      error: 'TaskId not found' 
    });
  }

  const deletetaskquery = `
    delete from task where task_id = ?
  `;

  db.query(
    deletetaskquery,
    [taskId],
    (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to create task' });
      }

      const taskId = result
      res.status(201).json({
        message: 'Task deleted successfully',
      });
    }
  );
});

router.post('/complete', verifyToken, (req, res) => {
  const {taskId} = req.body
  // Validation
  if (!taskId) {
    return res.status(400).json({ 
      error: 'TaskId not found' 
    });
  }

  const completetaskquery = `
    update task set status_id = 1 where task_id = ?
  `;

  db.query(
    completetaskquery,
    [taskId],
    (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to create task' });
      }

      const taskId = result
      res.status(201).json({
        message: 'Task completed successfully',
      });
    }
  );
})

// Update task status
// router.patch('/:taskId/status', verifyToken, (req, res) => {
//   const { taskId } = req.params;
//   const { status_id } = req.body;

//   if (![0, 1].includes(status_id)) {
//     return res.status(400).json({ error: 'Invalid status ID. Must be 0 or 1' });
//   }

//   const query = `
//     UPDATE TASKS 
//     SET STATUS_ID = ?
//     WHERE TASK_ID = ?
//   `;

//   db.query(query, [status_id, taskId], (err, result) => {
//     if (err) {
//       console.error('Database error:', err);
//       return res.status(500).json({ error: 'Failed to update task status' });
//     }

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ error: 'Task not found' });
//     }

//     res.status(200).json({
//       message: 'Task status updated successfully',
//       task_id: taskId,
//       status_id,
//       is_completed: status_id === 1
//     });
//   });
// });

// Delete task
// router.delete('/:taskId', verifyToken, (req, res) => {
//   const { taskId } = req.params;

//   const query = `
//     DELETE FROM TASKS
//     WHERE TASK_ID = ?
//   `;

//   db.query(query, [taskId], (err, result) => {
//     if (err) {
//       console.error('Database error:', err);
//       return res.status(500).json({ error: 'Failed to delete task' });
//     }

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ error: 'Task not found' });
//     }

//     res.status(200).json({
//       message: 'Task deleted successfully',
//       task_id: taskId
//     });
//   });
// });

module.exports = router;
