import React, { useState } from 'react';
import axios from 'axios';
import '../css/JoinProject.css'; // Adjusted path

function JoinProject() {
  const [projectId, setProjectId] = useState('');

  const handleJoin = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('No token found in localStorage. Please log in again.');
        window.location.reload();
      }

      // eslint-disable-next-line
      const response = await axios.post(
        'http://localhost:5000/api/project/join',
        { projectId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      alert('Joined project successfully');
      window.location.reload();
    } catch (error) {
      alert('Failed to join project: ' + (error.response?.data || error.message));
    }
  };

  return (
    <div className="join-project-form">
      <form onSubmit={handleJoin}>
        Project ID
        <input
          type="text"
          placeholder="Project ID"
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          required
        /><br />
        <button type="submit" className="submit-btn">Join Project</button>
      </form>
    </div>
  );
}

export default JoinProject;
