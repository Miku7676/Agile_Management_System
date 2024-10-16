import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'D:/DBMS/project/project_management_system/frontend/src/components/css/ShowProject.css'; // Make sure the path is correct based on your project structure

function ShowProjects({ onProjectSelect }) {
  const [userProjects, setUserProjects] = useState([]);

  useEffect(() => {
    const fetchUserProjects = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/project', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        setUserProjects(response.data);
      } catch (error) {
        console.error('Error fetching user projects:', error.message);
      }
    };
    fetchUserProjects();
  }, []);

  return (
    <div className="project-container">
      <h1>My Projects</h1>
      {userProjects.length ? (
        <ul className="project-list">
          {userProjects.map((project) => (
            <li 
              key={project.PROJECT_ID} 
              onClick={() => onProjectSelect(project.PROJECT_ID)} 
              className="project-item"
            >
              <div className="project-info">
                <span className="project-name">{project.NAME}</span>
                <span className="project-role">{project.ROLE}</span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="no-projects">
          <h2>No projects available</h2>
        </div>
      )}
      <hr />
    </div>
  );
}

export default ShowProjects;
