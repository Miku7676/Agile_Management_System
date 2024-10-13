import React, { useState } from 'react'
import ShowProjects from "./Projects/showProjects"
import CreateProject from "./Projects/createProject"
import JoinProject from "./Projects/joinProject"
import ProjectDetails from './Projects/ProjectDetails';


function Dashboard() {
  const [create, setCreate] = useState(false);
  const [join, setJoin] = useState(false);
  const [selectedProjectId,setSelectedProjectId] = useState();
  const handleCreate = ()=>{
    setCreate(true)
    setJoin(false)
  }
  const handleJoin = () => {
    setCreate(false)
    setJoin(true)
  }

  const handleProjectId = (projectId) => {
    setSelectedProjectId(projectId);
    console.log('Selected Project ID:', projectId);
  };

  return (
    <div>
      <ShowProjects onProjectSelect={handleProjectId} />
      <button onClick={handleCreate}>create</button>
      <button onClick={handleJoin}>join</button>
      {create && <CreateProject />}
      {join && <JoinProject/>}
      <hr />
      {selectedProjectId && <ProjectDetails projectId={selectedProjectId}/>}
      
    </div>
  )
}

export default Dashboard
