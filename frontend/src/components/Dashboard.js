import React, { useState } from 'react'
import ShowProjects from "./Projects/showProjects"
import CreateProject from "./Projects/createProject"
import JoinProject from "./Projects/joinProject"


function Dashboard() {
  const [create, setCreate] = useState(false);
  const [join, setJoin] = useState(false);
  const handleCreate = ()=>{
    setCreate(true)
    setJoin(false)
  }
  const handleJoin = () => {
    setCreate(false)
    setJoin(true)
  }
  return (
    <div>
      <ShowProjects />
      <button onClick={handleCreate}>create</button>
      <button onClick={handleJoin}>join</button>
      {create && <CreateProject />}
      {join && <JoinProject/>}
    </div>
  )
}

export default Dashboard
