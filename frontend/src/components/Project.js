import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function Project() {
  const [project, setProject] = useState(null);
  const [error, setError] = useState('');
  const { projectId } = useParams();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/project/${projectId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch project details');
        }
        const data = await response.json();
        setProject(data);
      } catch (error) {
        console.error('Error fetching project:', error);
        setError('Failed to load project details');
      }
    };

    fetchProject();
  }, [projectId]);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!project) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">{project.NAME}</h1>
      <p className="mb-4"><strong>Project ID:</strong> {project.PROJECT_ID}</p>
      <p className="mb-4"><strong>Scrum Master:</strong> {project.SCRUM_MASTER}</p>
      
      <h2 className="text-2xl font-bold mt-6 mb-4">Project Members</h2>
      {project.members && project.members.length > 0 ? (
        <ul className="list-disc pl-5">
          {project.members.map((member, index) => (
            <li key={index}>{member.USERNAME} ({member.USER_ID})</li>
          ))}
        </ul>
      ) : (
        <p>No members in this project yet.</p>
      )}
    </div>
  );
}

export default Project;