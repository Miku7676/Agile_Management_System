import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CreateProject from './Projects/createProject';
import JoinProject from './Projects/joinProject';
import './css/Project.css'; // Importing CSS for styling

function Project() {
  const [project, setProject] = useState(null);
  const [error, setError] = useState('');
  const { projectId } = useParams();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

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

  useEffect(() => {
    if (showCreateModal || showJoinModal) {
      document.body.classList.add('scroll-lock');
    } else {
      document.body.classList.remove('scroll-lock');
    }
  }, [showCreateModal, showJoinModal]);

  return (
    <div className="project-wrapper">
      {error ? (
        <div className="text-red-500">{error}</div>
      ) : project ? (
        <>
          <h1 className="project-title">{project.NAME}</h1>
          <p className="project-details"><strong>Project ID:</strong> {project.PROJECT_ID}</p>
          <p className="project-details"><strong>Scrum Master:</strong> {project.SCRUM_MASTER}</p>
          
          <h2 className="project-members-title">Project Members</h2>
          {project.members && project.members.length > 0 ? (
            <ul className="project-members-list">
              {project.members.map((member, index) => (
                <li key={index} className="project-member-item">{member.USERNAME} ({member.USER_ID})</li>
              ))}
            </ul>
          ) : (
            <p>No members in this project yet.</p>
          )}
        </>
      ) : (
        <div className="loading-spinner">Loading...</div>
      )}

      <div className="buttons-container">
        <button className="btn create-btn" onClick={() => setShowCreateModal(true)}>Create Project</button>
        <button className="btn join-btn" onClick={() => setShowJoinModal(true)}>Join Project</button>
      </div>

      {showCreateModal && (
        <div className="modal" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={() => setShowCreateModal(false)}>&times;</span>
            <CreateProject />
          </div>
        </div>
      )}

      {showJoinModal && (
        <div className="modal" onClick={() => setShowJoinModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={() => setShowJoinModal(false)}>&times;</span>
            <JoinProject />
          </div>
        </div>
      )}
    </div>
  );
}

export default Project;
