import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/ProjectDetails.css'

function ProjectDetails({ projectId }) {
  const [projectDetails, setProjectDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/project/${projectId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        setProjectDetails(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchProjectDetails();
    }
  }, [projectId]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  if (!projectDetails) return null;

  const { projectDetails: details, MemberDetails, SprintDetails } = projectDetails;

  return (
    <div className="project-details">
      <h2>Project: {details.NAME} ({details.PROJECT_ID})</h2>
      <p style={{ padding: '10px' }}>
  <strong>Start Date:</strong> {new Date(details.START_DATE).toLocaleDateString()} 
  <span style={{ margin: '0 10px' }}></span>
  <strong>End Date:</strong> {details.END_DATE ? new Date(details.END_DATE).toLocaleDateString() : 'Not specified'}
</p>

<div style={{padding: '10px' }}>
  <strong>Project Manager:</strong> 
  <span style={{ margin: '0 10px' }}>{details.PROJECT_MANAGER}</span>
  <strong>Scrum Master:</strong> 
  <span>{details.SCRUM_MASTER}</span>
</div>


      <p><strong>Description:</strong> {details.DESCRIPTION}</p>


      <h3>Members:</h3>
      <ul>
        {MemberDetails.map(member => (
          <li key={member.USER_ID}>{member.USER_ID} - {member.ROLE}</li>
        ))}
      </ul>

      <h3>Sprints:</h3>
      <ul>
        {SprintDetails.map(sprint => (
          <li key={sprint.SPRINT_ID}>{sprint.NAME}</li>
        ))}
      </ul>
    </div>
  );
}

export default ProjectDetails;
