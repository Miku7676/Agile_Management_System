import React, { useState } from 'react';
import axios from 'axios';
import '../css/CreateTask.css';

function CreateTask({ projectId, sprintId, onClose, onTaskCreated }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assigned_to: '',
    status_id: 0, // Default to 'in progress'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? 
      (e.target.checked ? 1 : 0) : 
      e.target.value;
      
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:5000/api/project/${projectId}/tasks/create`,
        {
          ...formData,
          sprint_id: sprintId
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data) {
        onTaskCreated(); // Refresh the task list
        onClose(); // Close the modal
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <div className="modal-header">
        <h2>Create New Task</h2>
        <span className="close-btn" onClick={onClose}>&times;</span>
      </div>
      
      <form onSubmit={handleSubmit} className="task-form">
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-group">
          <label htmlFor="title">Task Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Enter task title"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            placeholder="Enter task description"
            rows="4"
          />
        </div>

        <div className="form-group">
          <label htmlFor="assigned_to">Assign To:</label>
          <input
            type="text"
            id="assigned_to"
            name="assigned_to"
            value={formData.assigned_to}
            onChange={handleChange}
            required
            placeholder="Enter assignee's username"
          />
        </div>

        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="status_id"
              checked={formData.status_id === 1}
              onChange={handleChange}
            />
            Mark as Completed
          </label>
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className="submit-btn" 
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Task'}
          </button>
          <button 
            type="button" 
            className="cancel-btn" 
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateTask;