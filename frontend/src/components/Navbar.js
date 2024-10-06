import React from 'react';
import { Link } from 'react-router-dom';

export const NAVBAR_HEIGHT = 100; // Matching the paddingTop in AppLayout

const navStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  backgroundColor: 'black',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  zIndex: 1000,
  height: `${NAVBAR_HEIGHT}px`,
};

const containerStyle = {
  display: 'flex',
  alignItems: 'center',
  height: '100%',
  paddingLeft: '20px', // Add some padding on the left
};

const logoStyle = {
  height: '32px',
  width: 'auto',
  marginRight: '20px', // Add some space between logo and links
};

const linkContainerStyle = {
  display: 'flex',
  gap: '20px',
};

const linkStyle = {
  padding: '8px 12px',
  borderRadius: '4px',
  color: '#d1d5db',
  fontSize: '24px',
  fontWeight: '500',
  textDecoration: 'none',
  transition: 'background-color 0.15s, color 0.15s',
};

function Navbar() {
  return (
    <nav style={navStyle}>
      <div style={containerStyle}>
        <img style={logoStyle} src="/api/placeholder/32/32" alt="Logo" />
        <div style={linkContainerStyle}>
          <NavLink to="/">Dashboard</NavLink>
          <NavLink to="/tasks">Tasks</NavLink>
          <NavLink to="/sprints">Sprints</NavLink>
          <NavLink to="/users">Users</NavLink>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ to, children }) {
  return (
    <Link
      to={to}
      style={linkStyle}
      onMouseEnter={(e) => {
        e.target.style.backgroundColor = '#4b5563';
        e.target.style.color = 'white';
      }}
      onMouseLeave={(e) => {
        e.target.style.backgroundColor = 'transparent';
        e.target.style.color = '#d1d5db';
      }}
    >
      {children}
    </Link>
  );
}

export default Navbar;