import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useParams } from 'react-router-dom';
import '../css/DetailedSprint.css';
import CreateTask from '../Tasks/CreateTask';
import { FaCheck, FaTrash } from 'react-icons/fa';

function DetailedSprint() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { projectId, sprintId } = useParams();
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const [userRole,setUserRole] = useState('')
  const [userId,setUserId] = useState()
  const location = useLocation();


  useEffect(() => {
    const tkn = sessionStorage.getItem('token');
    tkn && setUserId(JSON.parse(atob(tkn.split('.')[1])).userId);
  }, [location]);

  const fetchTasks = useCallback(async () => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/project/${projectId}/sprint/${sprintId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setTasks(response.data[1]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [projectId, sprintId]);

  useEffect(() => {
    if (projectId) {
      fetchTasks();
    }
  }, [projectId, sprintId, fetchTasks]);

  useEffect(()=>{
    setUserRole(sessionStorage.getItem('role'));
  },[])

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  const closeModal = () => {
    setShowCreateTask(false);
  };

  const deleteTask = async (taskId)=>{
    // 
    try {
      setLoading(true);
      const token = sessionStorage.getItem('token');
      const response = await axios.post(`http://localhost:5000/api/project/${projectId}/sprint/${sprintId}/task/delete`,
        {taskId}, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      console.log(response);
    }catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }
  const handleCompleteTask = async (taskId) => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem('token');
      const response = await axios.post(`http://localhost:5000/api/project/${projectId}/sprint/${sprintId}/task/complete`,
        {taskId}, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      console.log(response);
      fetchTasks();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(taskId); 
        fetchTasks();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const toggleTaskDetails = (taskId) => {
    setExpandedTaskId(prevId => (prevId === taskId ? null : taskId)); // Toggle task details visibility
  };
  const isAllowedToModify = (role) => {
    return role === 'SCRUM_MASTER' || role === 'PROJECT_MANAGER'; // Only these roles are allowed
  };

  return (
    <div className="tasks-container">
      <h2>Tasks for Project ID: {projectId}</h2>
      {sprintId && <h3>Sprint ID: {sprintId}</h3>}
      <button
        className="create-sprint-btn"
        onClick={() => setShowCreateTask(true)}
      >
        Create Task
      </button>

      {tasks.length > 0 ? (
        <ul className="tasks-list">
          {tasks.map((task) => {
            const isCompleted = task.NAME === 'completed'; // Check if the task is completed
            const taskClass = isCompleted ? 'task-completed' : 'task-running'; // Assign class based on status

            return (
              <li key={task.TASK_ID} className={`task-item ${taskClass}`}>
                {/* Display task name, status, assigned-to on a single line */}
                <div className="task-summary" onClick={() => {toggleTaskDetails(task.TASK_ID)}}>
                  <h4>{task.TITLE}</h4>
                  <p><strong>Assigned To:</strong> {task.ASSIGNED_TO}</p>

                  {!isCompleted ?(
                    <div className="task-actions">
                      {task.ASSIGNED_TO === userId ?(<button
                        className="complete-task-btn"
                        onClick={() => handleCompleteTask(task.TASK_ID)}
                      >
                        <FaCheck />
                      </button>):null}
                      {isAllowedToModify(userRole)?(<button
                        className="delete-task-btn"
                        onClick={() => handleDeleteTask(task.TASK_ID)}
                      >
                        <FaTrash />
                      </button>):null}
                    </div>
                  ):null}
                </div>

                {/* Show additional details when the task is clicked */}
                {expandedTaskId === task.TASK_ID && (
                  <div className="task-details">
                    <p><strong>Description:</strong> {task.DESCRIPTION}</p>
                    <p><strong>Task ID:</strong> {task.TASK_ID}</p>
                    <p><strong>Status:</strong> {task.NAME}</p>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <p>No tasks available</p>
      )}

      {showCreateTask && (
        <div className="modal-container" onClick={closeModal}>
          <CreateTask
            projectId={projectId}
            sprintId={sprintId}
            onClose={closeModal}
            onTaskCreated={fetchTasks}
          />
        </div>
      )}
    </div>
  );
}

export default DetailedSprint;
