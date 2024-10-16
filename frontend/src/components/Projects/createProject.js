import React, { useState } from 'react';
import axios from 'axios';
import 'D:/DBMS/project/project_management_system/frontend/src/components/css/CreateProject.css'; // Adjusted path

function CreateProject() {
  const [projectName, setProjectName] = useState('');
  const [scrumMasterId, setSMId] = useState('');
  const [projectDescription, setProjectDescription] = useState('');

  const handleCreate = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('No token found in localStorage. Please log in again.');
        window.location.reload();
      }

      const response = await axios.post(
        'http://localhost:5000/api/project/create',
        {
          name: projectName,
          scrumMasterId: scrumMasterId,
          description: projectDescription,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      alert('Project created successfully');
      window.location.reload();
    } catch (error) {
      alert('Failed to create project: ' + (error.response?.data || error.message));
    }
  };

  return (
    <div className="create-project-form">
      <form onSubmit={handleCreate}>
        Project Name <input
          type="text"
          placeholder="Project Name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          required
        /><br />
        Scrum Master ID
        <input
          type="text"
          placeholder="Scrum Master ID"
          value={scrumMasterId}
          onChange={(e) => setSMId(e.target.value)}
          required
        /><br />
        Project Description
        <textarea
          placeholder="Project Description"
          value={projectDescription}
          onChange={(e) => setProjectDescription(e.target.value)}
        /><br />
        <button type="submit" className="submit-btn">Create Project</button>
      </form>
    </div>
  );
}

export default CreateProject;
