import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import '../css/ProjectDetails.css';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Comment from '../Comments/Comment';
import CreateSprint from '../sprints/CreateSprint';
// import CreateTask from '../Tasks/CreateTask';

function ProjectDetails() {
  const [projectDetails, setProjectDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { projectId } = useParams();
  const [comments, setComments] = useState(false);
  const [showCreateSprint, setShowCreateSprint] = useState(false);
  const [userId,setUserId] = useState();
  const location = useLocation();
  const navigate = useNavigate();


  useEffect(() => {
    const tkn = sessionStorage.getItem('token')
    tkn && setUserId(JSON.parse(atob(tkn.split('.')[1])).userId);
  }, [location]);
  // const [showCreateTask, setShowCreateTask] = useState(false);
  // const [selectedSprintId, setSelectedSprintId] = useState(null);
  

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
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  },[projectId])

  

  useEffect(() => {
    if (projectId) {
      fetchProjectDetails();
    }
  }, [projectId,fetchProjectDetails]);

  const closeModal = () => {
    setComments(false);
    setShowCreateSprint(false);
    // setShowCreateTask(false);
    // setSelectedSprintId(null);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!projectDetails) return null;
  const { projectDetails: details, MemberDetails, SprintDetails } = projectDetails;
  return (
    <div className='container'>
      <div className="project-details">
        <h2>Project: {details.NAME} ({details.PROJECT_ID})</h2>
        <p style={{ padding: '10px' }}>
          <strong>Start Date:</strong> {new Date(details.START_DATE).toLocaleDateString()} 
          <span style={{ margin: '0 10px' }}></span>
          <strong>End Date:</strong> {details.END_DATE ? new Date(details.END_DATE).toLocaleDateString() : 'Not specified'}
        </p>

        <div style={{padding: '10px', display: 'flex', justifyContent:'center'}}>
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
            <ul className="sprint-list" >
                {SprintDetails.map(sprint => (
                  <li key={sprint.SPRINT_ID} className="sprint-item" onClick={()=>{navigate(`/project/${projectId}/${sprint.SPRINT_ID}`)}}>
                    <div className="sprint-name">{sprint.NAME}</div>
                    <div className="sprint-desc">{sprint.Description}</div>
                    <div className="sprint-dates">
                      {new Date(sprint.START_DT).toLocaleDateString()} - 
                      {new Date(sprint.END_DT).toLocaleDateString()}
                    </div>
                  </li>
                ))}
            </ul>
          ) : (
            <p>No sprints created yet</p>
          )}
        

          {/* create sprint (only availiable to scrum master) */}
          {(userId === details.SCRUM_MASTER)?(
            <div className="button-container">
              <button 
                className="create-sprint-btn"
                onClick={() => setShowCreateSprint(true)}
              >
                Create Sprint
              </button>
            </div>
          ):(null)}
          

        </div>
        

        {/* comments button */}
        <div className="button-container">
          <button className="openComment" onClick={() => setComments(true)}>
            Open Comments
          </button>
        </div>
        

        {/* render comments component from state */}
        {comments && (
          <div className="comment-modal-container" onClick={closeModal}>
            <div className="comment-modal-content" onClick={(e) => e.stopPropagation()}>
              <span className="comment-close-btn" onClick={closeModal}>&times;</span>
              <span>&nbsp;</span>
              <Comment />
            </div>
          </div>
        )}

        {/* render create sprint component */}
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
      {/* {showCreateTask && selectedSprintId && (
        <div className="modal-container" onClick={closeModal}>
          <CreateTask
            projectId={projectId}
            sprintId={selectedSprintId}
            onClose={closeModal}
            onTaskCreated={fetchProjectDetails}
          />
        </div>
      )} */}
    </div>
  );
}

export default ProjectDetails;