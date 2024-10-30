import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import '../css/DetailedSprint.css';

function DetailedSprint() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { projectId, sprintId } = useParams();
  const navigate = useNavigate();

  const fetchTasks = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const url = sprintId
        ? `http://localhost:5000/api/project/${projectId}/sprint/${sprintId}/tasks`
        : `http://localhost:5000/api/project/${projectId}/tasks`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setTasks(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchTasks();
    }
  }, [projectId, sprintId]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="tasks-container">
      <h2>Tasks for Project ID: {projectId}</h2>
      {sprintId && <h3>Sprint ID: {sprintId}</h3>}
      {tasks.length > 0 ? (
        <ul className="tasks-list">
          {tasks.map(task => (
            <li key={task.TASK_ID} className="task-item">
              <h4>{task.TITLE}</h4>
              <p><strong>Description:</strong> {task.DESCRIPTION}</p>
              <p><strong>Assigned To:</strong> {task.ASSIGNED_TO}</p>
              <p><strong>Status:</strong> {task.STATUS_NAME}</p>
              <p><strong>Task ID:</strong> {task.TASK_ID}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No tasks available</p>
      )}
    </div>
  );
}

export default DetailedSprint;
