// CreateSprint.js
import React, { useState } from 'react';
import axios from 'axios';
import '../css/CreateSprint.css'

function CreateSprint({ projectId, onClose, onSprintCreated }) {
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    desc:''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
  
    try {
      const token = sessionStorage.getItem('token');
  
      // Format dates to yyyy-mm-dd
      const formatDate = (date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        console.log(`${year}-${month}-${day}`);
        return `${year}-${month}-${day}`;
      };
  
      const formattedData = {
        ...formData,
        startDate: formatDate(formData.startDate),
        endDate: formatDate(formData.endDate),
      };
      
  
      await axios.post(
        `http://localhost:5000/api/project/${projectId}/sprint/create`,
        formattedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      onSprintCreated(); // Refresh the sprint list
      onClose(); // Close the modal
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create sprint');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <div className="modal-header">
        <h2>Create New Sprint</h2>
        <span className="close-btn" onClick={onClose}>&times;</span>
      </div>
      
      <form onSubmit={handleSubmit} className="sprint-form">
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-group">
          <label htmlFor="name">Sprint Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter sprint name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="startDate">Start Date:</label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="endDate">End Date:</label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="desc">Description:</label>
          <textarea
            id="desc"
            name="desc"
            value={formData.desc}
            onChange={handleChange}
            required
            placeholder="Enter sprint description"
          />
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className="submit-btn" 
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Sprint'}
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

export default CreateSprint;