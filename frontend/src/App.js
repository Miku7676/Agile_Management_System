import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import TaskList from './components/TaskList';
import SprintList from './components/SprintList';
import UserList from './components/UserList';
import Login from './components/Login'; // Import Login component
import SignUp from './components/SignUp';
// import Project from './components/Project';
import ProtectedRoute from './components/ProtectedRoute'; // For protecting routes
import AppLayout from './components/AppLayout'; // This should NOT contain a <Router>
import ProjectDetails from './components/Projects/ProjectDetails';
import DetailedSprint from './components/sprints/DetailedSprint';

// import { useNavigate } from 'react-router-dom';

function App() {
  // Clear token when app is started or refreshed
  // useEffect(() => {
  //   localStorage.removeItem('token');
  // }, []);

  return (
    // Wrap your whole app in a single Router
    <Router>
      <div className="App">
        {/* No Router inside AppLayout */}
        <AppLayout>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tasks"
              element={
                <ProtectedRoute>
                  <TaskList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sprints"
              element={
                <ProtectedRoute>
                  <SprintList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users"
              element={
                <ProtectedRoute>
                  <UserList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/project/:projectId"
              element={
                <ProtectedRoute>
                  <ProjectDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/project/:projectId/:sprintId"
              element={
                <ProtectedRoute>
                  <DetailedSprint />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AppLayout>
      </div>
    </Router>
  );
}

export default App;
