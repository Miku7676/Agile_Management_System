import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import TaskList from './components/TaskList';
import SprintList from './components/SprintList';
import UserList from './components/UserList';
import Login from './components/Login'; // Import Login component
import AppLayout from './components/AppLayout ';
import SignUp from './components/SignUp';
import Project from './components/Project';

function App() {
  return (
    <Router>
      <div className="App">
        <AppLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/tasks" element={<TaskList />} />
            <Route path="/sprints" element={<SprintList />} />
            <Route path="/users" element={<UserList />} />
            <Route path="/login" element={<Login />} /> {/* Add Login route */}
            <Route path="/signup" element={<SignUp />} /> {/* Add Login route */}
            <Route path="/Project/:projectId" element={<Project />}/>
          </Routes>
        </AppLayout>
      </div>
    </Router>
  );
}

export default App;