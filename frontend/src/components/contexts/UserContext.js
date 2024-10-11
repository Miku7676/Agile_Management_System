import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userId,setUserId] = useState('')
  useEffect(() => {
    // Fetch user details from JWT token
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log(payload.userId);
      setUserId(payload.userId);
      
    }
  },[]);
  return (
    <UserContext.Provider value={{ userId }}>
      {children}
    </UserContext.Provider>
  );
};

export const UserValue = () => useContext(UserContext);