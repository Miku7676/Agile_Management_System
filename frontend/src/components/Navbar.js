import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserValue } from './contexts/UserContext';
import './css/Navbar.css'; // Import the CSS file

export const NAVBAR_HEIGHT = 100; // Matching the paddingTop in AppLayout

function Navbar() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const location = useLocation();
  const { userId } = UserValue();

  useEffect(() => {
    setToken(localStorage.getItem('token'));
  }, [location]);

  const logOut = () => {
    token && localStorage.removeItem('token');
    setToken(null);
    console.log("logout");
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Left-side links */}
        <div className="navbar-links">
          <Link to="/" className="navbar-logo">
            <img src="/managepro.png" alt="Logo" />
          </Link>
          {token && (
            <>
              <NavLink to="/">Dashboard</NavLink>
              <NavLink to="/tasks">Tasks</NavLink>
              <NavLink to="/sprints">Sprints</NavLink>
              <NavLink to="/users">Users</NavLink>
            </>
          )}
        </div>

        {/* Right-side user dropdown */}
        {token && (
          <div className="user-dropdown">
            <button className="user-button" onClick={toggleDropdown}>
              {userId}
            </button>
            {dropdownVisible && (
              <div className="dropdown-menu">
                <div onClick={logOut} className="dropdown-item">Logout</div>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

function NavLink({ to, children }) {
  return (
    <Link to={to} className="navbar-link">
      {children}
    </Link>
  );
}

export default Navbar;
