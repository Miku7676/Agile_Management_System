import React, { useState } from 'react'
import axios from 'axios';

function JoinProject() {
  const [projectId,setProjectId] = useState('');

  const handleJoin = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('No token found in localStorage. Please log in again.');
        window.location.reload()
      }

      const requestOptions = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.post('http://localhost:5000/api/project/join', {
        projectId : projectId
      }, requestOptions);
      console.log(response.data);
      alert("joined to project successfully")
      window.location.reload();

    } catch (error) {
        if (error.status === 406){
            console.error(error);
            alert(error.response.data);
        }
        console.error('joining group:', error.message);
    }
  }

  return (
    <div>
      <form onSubmit={handleJoin}>
            <input type="text" placeholder="project name" value={projectId} required onChange={(e)=>{setProjectId(e.target.value)}} /><br/>
            <button type='submit'>submit</button>
        </form>
    </div>
  )
}

export default JoinProject
