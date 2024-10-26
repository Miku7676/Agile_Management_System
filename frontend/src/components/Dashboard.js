import React, { useState } from 'react';
import ShowProjects from "./Projects/showProjects";
import CreateProject from "./Projects/createProject";
import JoinProject from "./Projects/joinProject";
// import ProjectDetails from './Projects/ProjectDetails';
import './css/Dashboard.css';  // Ensure your path is correct


function Dashboard() {
  const [create, setCreate] = useState(false);
  const [join, setJoin] = useState(false);
  // const [selectedProjectId, setSelectedProjectId] = useState();
  

  const handleCreate = () => {
    setCreate(true);
    setJoin(false);
  };

  const handleJoin = () => {
    setCreate(false);
    setJoin(true);
  };

  // const handleProjectId = (projectId) => {
  //   setSelectedProjectId(projectId);
  //   console.log('Selected Project ID:', projectId);
  // };

  const closeModal = () => {
    setCreate(false);
    setJoin(false);
  };

  return (
    <div className="dashboard-container">
      <div className={create || join ? 'dashboard-content-blur' : 'dashboard-content'}>
        <ShowProjects />
        <div className="button-container">
          <button className="create" onClick={handleCreate}>Create</button>
          <button className="join" onClick={handleJoin}>Join</button>
        </div>
      </div>

      {/* Project Details Section */}
      {/* <div className="project">
        {selectedProjectId && <ProjectDetails projectId={selectedProjectId} showComments={setComments} />}
      </div> */}

      
      {/* Modal for Create or Join */}
      {(create || join) && (
        <div className="modal-container" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-btn" onClick={closeModal}>&times;</span>
            {create && <CreateProject />}
            {join && <JoinProject />}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
