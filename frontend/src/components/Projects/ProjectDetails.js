import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ProjectDetails({ projectId }) {
  const [projectDetails, setProjectDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/project/${projectId}`,{
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  if (!projectDetails) return null;

  const { projectDetails: details, MemberDetails, SprintDetails } = projectDetails;

  return (
    <div>
      <h2>Project: {details.NAME} ({details.PROJECT_ID})</h2>
      <p>Description: {details.DESCRIPTION}</p>
      <p>Start Date: {new Date(details.START_DATE).toLocaleDateString()}</p>
      <p>End Date: {details.END_DATE ? new Date(details.END_DATE).toLocaleDateString() : 'Not specified' /*have to chamge the date input */}</p>
      <p>Project Manager: {details.PROJECT_MANAGER}</p>
      <p>Scrum Master: {details.SCRUM_MASTER}</p>

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
