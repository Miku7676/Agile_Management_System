import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import '../css/ProjectDetails.css';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Comment from '../Comments/Comment';
import CreateSprint from '../sprints/CreateSprint';
import { FaTrashAlt } from 'react-icons/fa';  // Importing FontAwesome delete icon

function ProjectDetails() {
  const [projectDetails, setProjectDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { projectId } = useParams();
  const [comments, setComments] = useState(false);
  const [showCreateSprint, setShowCreateSprint] = useState(false);
  const [userId, setUserId] = useState();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const tkn = sessionStorage.getItem('token');
    tkn && setUserId(JSON.parse(atob(tkn.split('.')[1])).userId);
  }, [location]);


  const fetchProjectDetails = useCallback(async () => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/project/${projectId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setProjectDetails(response.data);
      console.log();
      if (response.data.projectDetails.PROJECT_MANAGER === userId) sessionStorage.setItem('role','PROJECT_MANAGER');
      if (response.data.projectDetails.SCRUM_MASTER === userId) sessionStorage.setItem('role','SCRUM_MASTER');
      else sessionStorage.removeItem('role');
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [projectId, userId]);

  useEffect(() => {
    if (projectId) {
      fetchProjectDetails();
    }
  }, [projectId, fetchProjectDetails]);

  const closeModal = () => {
    setComments(false);
    setShowCreateSprint(false);
  };

  const handleDeleteSprint = async (sprintId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        setLoading(true);
        const token = sessionStorage.getItem('token');
        const response = await axios.post(`http://localhost:5000/api/project/${projectId}/sprint/delete`,
          {sprintId}, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        console.log(response);
        fetchProjectDetails();
      }catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!projectDetails) return null;

  const { projectDetails: details, MemberDetails, SprintDetails } = projectDetails;

  return (
    <div className="container">
      <div className="project-details">
        <h2>Project: {details.NAME} ({details.PROJECT_ID})</h2>
        <p style={{ padding: '10px' }}>
          <strong>Start Date:</strong> {new Date(details.START_DATE).toLocaleDateString()}
          <span style={{ margin: '0 10px' }}></span>
          <strong>End Date:</strong> {details.END_DATE ? new Date(details.END_DATE).toLocaleDateString() : 'Not specified'}
        </p>

        <div style={{ padding: '10px', display: 'flex', justifyContent: 'center' }}>
          <strong>Project Manager:</strong>
          <span style={{ margin: '0 10px' }}>{details.PROJECT_MANAGER}</span>
          <strong>Scrum Master:</strong>
          <span>{details.SCRUM_MASTER}</span>
        </div>

        <p><strong>Description:</strong> {details.DESCRIPTION}</p>

        {/* Members */}
        <h3>Members:</h3>
        <ul>
          {MemberDetails.map(member => (
            <li key={member.USER_ID}>{member.USER_ID} - {member.ROLE}</li>
          ))}
        </ul>

        {/* Sprints */}
        <h3>Sprints:</h3>
        <div className="sprint-section">
          {SprintDetails.length > 0 ? (
            <ul className="sprint-list">
              {SprintDetails.map(sprint => (
                <li
                  key={sprint.SPRINT_ID}
                  className="sprint-item"
                  onClick={() => navigate(`/project/${projectId}/${sprint.SPRINT_ID}`)}
                >
                  <div className="sprint-name">{sprint.NAME}</div>
                  <div className="sprint-desc">{sprint.Description}</div>
                  <div className="sprint-dates">
                    {new Date(sprint.START_DT).toLocaleDateString()} - 
                    {new Date(sprint.END_DT).toLocaleDateString()}
                  </div>

                  {/* Delete button (only visible to Scrum Master or Project Manager) */}
                  {(userId === details.SCRUM_MASTER || userId === details.PROJECT_MANAGER) && (
                    <button
                      className="delete-sprint-btn"
                      onClick={(e) => {
                        e.stopPropagation();  // Prevent event propagation
                        handleDeleteSprint(sprint.SPRINT_ID);  // Delete sprint
                      }}
                    >
                      <FaTrashAlt /> {/* FontAwesome delete icon */}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>No sprints created yet</p>
          )}

          {/* Create Sprint (Only available to Scrum Master) */}
          {userId === details.SCRUM_MASTER && (
            <div className="button-container">
              <button
                className="create-sprint-btn"
                onClick={() => setShowCreateSprint(true)}
              >
                Create Sprint
              </button>
            </div>
          )}
        </div>

        {/* Comments Button */}
        <div className="button-container">
          <button className="openComment" onClick={() => setComments(true)}>
            Open Comments
          </button>
        </div>

        {/* Render comments component */}
        {comments && (
          <div className="comment-modal-container" onClick={closeModal}>
            <div className="comment-modal-content" onClick={(e) => e.stopPropagation()}>
              <span className="comment-close-btn" onClick={closeModal}>&times;</span>
              <Comment />
            </div>
          </div>
        )}

        {/* Render Create Sprint Component */}
        {showCreateSprint && (
          <div className="modal-container" onClick={closeModal}>
            <CreateSprint
              projectId={projectId}
              onClose={closeModal}
              onSprintCreated={fetchProjectDetails}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectDetails;
