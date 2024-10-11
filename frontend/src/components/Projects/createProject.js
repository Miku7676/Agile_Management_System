import React, { useState } from 'react'
import axios from 'axios';

function CreateProject() {
    // const navigate = useNavigate();
    const [projectName,setProjectName] = useState('');
    const [scrumMasterId,setSMId] = useState('');
    const [projectDescription,setProjectDescription] = useState("");


    const handleCreate = async (e) => {
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
    
          const response = await axios.post('http://localhost:5000/api/project/create', {
            name: projectName,
            scrumMasterId : scrumMasterId,
            description: projectDescription
          }, requestOptions);
          console.log(response.data);
          alert("project created successfully")
          window.location.reload();

        } catch (error) {
            if (error.status === 406){
                console.error(error);
                alert("userid for scrum master does not exist");
            }
            console.error('Error creating/joining group:', error.message);
        }

    
      };
  return (
    <div>
        <form onSubmit={handleCreate}>
            <input type="text" placeholder="project name" value={projectName} required onChange={(e)=>{setProjectName(e.target.value)}} /><br/>
            <input type="text" placeholder="scrum master id" value={scrumMasterId} required onChange={(e)=>{setSMId(e.target.value)}} /><br/>
            <textarea placeholder='project description' value={projectDescription} onChange={(e)=>{setProjectDescription(e.target.value)}} /><br/>
            <button type='submit'>submit</button>
        </form>
      
    </div>
  )
}

export default CreateProject
