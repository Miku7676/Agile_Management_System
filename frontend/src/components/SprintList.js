import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function SprintList() {
  const [project, setProject] = useState(null);
  const { groupId } = useParams(); // Changed from projectId to groupId

  useEffect(() => {
    // Fetch the project data from the backend
    axios.get(`http://localhost:5000/api/projects/${groupId}`)
      .then(response => {
        console.log('Fetched project data:', response.data); // For debugging
        setProject(response.data);
      })
      .catch(error => console.error('Error fetching project:', error));
  }, [groupId]);

  if (!project) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Project Details</h2>
      <h3>Group Name: {project.group_name}</h3>
      <p>Group ID: {project.group_id}</p>
      <p>Scrum Master ID: {project.scrum_master_id}</p>
      
      {/* You can add more project details or a list of sprints here */}
    </div>
  );
}

export default SprintList;