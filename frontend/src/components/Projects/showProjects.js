import React, { useEffect, useState } from 'react'
import axios from 'axios';

function ShowProjects() {
    const [userProjects,setUserProjects] = useState([])

    useEffect( () => {
        const fetchUserProjects = async () => {
            try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/project', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            setUserProjects(response.data); // Assuming the response contains the projects list
            } catch (error) {
                console.error('Error fetching user projects:', error.message);
            //   setError(`Failed to fetch user projects: ${error.message}`);
            }
        }
        fetchUserProjects();
        
    }, []) 
  return (
    <div>
        <h1>Projects [-show]</h1>
        {console.log(userProjects[0])}
        {userProjects.length ? (
            <ul>
                {userProjects.map(project => (
                <li key={project.PROJECT_ID}>
                    {project.PROJECT_ID} - {project.NAME} - {project.ROLE}
                </li>
                ))}
            </ul>
        ): (<><h2>No projects</h2></>)}
        <hr />
    </div>
  )
}

export default ShowProjects
