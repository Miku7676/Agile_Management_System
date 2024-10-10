import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [showModal, setShowModal] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [scrumMasterId, setScrumMasterId] = useState('');
  const [groupId, setGroupId] = useState('');
  const [error, setError] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [userId, setUserId] = useState('');
  const [projectDetails, setProjectDetails] = useState(null);
  const [userProjects, setUserProjects] = useState([]);
  const [showProjects, setShowProjects] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user details from JWT token
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUserId(payload.userId);
    }
  }, []);

  const fetchProjectDetails = async (projectId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/project/${projectId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch project details');
      }
  
      const projectDetails = await response.json();
      return projectDetails;
    } catch (error) {
      console.error('Error fetching project details:', error);
      return null;
    }
  };
  
  const fetchUserProjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/project/projects', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch user projects');
      }
  
      const data = await response.json();
      setProjectDetails(data); // Assuming you set the projects here
    } catch (error) {
      console.error('Error fetching user projects:', error);
      setError(`Failed to fetch user projects: ${error.message}`);
    }
  };
  

  const handleCreateOrJoinGroup = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found in localStorage. Please log in again.');
      }

      let response;
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          projectId: groupId,      // For joining, it sends projectId
          name: groupName,         // For creating, it sends the project name
          scrumMaster: scrumMasterId, // For creating, it sends the scrum master ID
        }),
      };

      if (isJoining) {
        response = await fetch('/api/project/join', requestOptions);
      } else {
        response = await fetch('/api/project', requestOptions);
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
      }

      const data = await response.json();
      const projectDetails = await fetchProjectDetails(data.projectId);
      
      if (projectDetails) {
        setProjectDetails(projectDetails);
      }

      navigate(`/Project/${data.projectId}`);
    } catch (error) {
      console.error('Error creating/joining group:', error);
      setError(`Failed to create/join group: ${error.message}`);
    }

    setShowModal(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Project Management Dashboard</h1>
      
      <button onClick={() => { setShowModal(true); setIsJoining(false); }} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 mr-4">
        Create New Project
      </button>
      <button onClick={() => { setShowModal(true); setIsJoining(true); }} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4">
        Join Existing Project
      </button>
      <button onClick={fetchUserProjects} className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded mb-4">
        Show My Projects
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {isJoining ? 'Join Existing Project' : 'Create New Project'}
              </h3>
              <form onSubmit={handleCreateOrJoinGroup} className="mt-2 px-7 py-3">
                {isJoining ? (
                  <input
                    type="text"
                    placeholder="Enter project ID"
                    value={groupId}
                    onChange={(e) => setGroupId(e.target.value)}
                    className="mt-2 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
                    required
                  />
                ) : (
                  <>
                    <input
                      type="text"
                      placeholder="Enter project name"
                      value={groupName}
                      onChange={(e) => setGroupName(e.target.value)}
                      className="mt-2 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Enter Scrum Master ID"
                      value={scrumMasterId}
                      onChange={(e) => setScrumMasterId(e.target.value)}
                      className="mt-2 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
                      required
                    />
                  </>
                )}
                <div className="mt-4">
                  <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    {isJoining ? 'Join Project' : 'Create Project'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Display user's projects */}
      {showProjects && (
        <div className="mt-6">
          <h2 className="text-2xl font-bold mb-4">My Projects</h2>
          <ul className="list-disc ml-5 mt-2">
            {userProjects.map((project) => (
              <li key={project.PROJECT_ID}>
                {project.NAME} (Scrum Master: {project.SCRUM_MASTER_NAME})
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Display project details after fetching */}
      {projectDetails && (
        <div className="mt-6">
          <h2 className="text-2xl font-bold mb-4">Project Details</h2>
          <p><strong>Project Name:</strong> {projectDetails.NAME}</p>
          <p><strong>Project ID:</strong> {projectDetails.PROJECT_ID}</p>
          <p><strong>Scrum Master:</strong> {projectDetails.SCRUM_MASTER}</p>
          <h3 className="text-xl font-bold mt-4">Team Members:</h3>
          <ul className="list-disc ml-5 mt-2">
            {projectDetails.teamMembers.map((member) => (
              <li key={member.USER_ID}>
                {member.USERNAME} (Role: {member.ROLE})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
