import React from 'react';
import Navbar, { NAVBAR_HEIGHT } from './Navbar';

const mainContentStyle = {
  paddingTop: `${NAVBAR_HEIGHT}px`,
  minHeight: '100vh',
  paddingLeft: '20px', // Add some padding to align with the navbar content
};

function AppLayout({ children }) {
  return (
    <div>
      <Navbar />
      <main style={mainContentStyle}>
        {children}
      </main>
    </div>
  );
}

export default AppLayout;