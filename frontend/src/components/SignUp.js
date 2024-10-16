import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './css/SignUp.css';  // Importing the CSS file for styling

function SignUp() {
  const [userid, setUserID] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSignup = (e) => {
    e.preventDefault();

    const userData = {
      userid,
      username,
      email,
      password,
      created_at: new Date().toISOString(),
    };

    axios
      .post('http://localhost:5000/api/users/signup', userData)
      .then((response) => {
        console.log('User created:', response.data);
        setMessage('User successfully created!');
      })
      .catch((error) => {
        console.error('Error creating user:', error);
        setMessage('Error creating user. Please try again.');
      });
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>Sign Up</h2>
        {message && <p style={{ color: 'red' }}>{message}</p>}
        <form onSubmit={handleSignup}>
          <div className="form-group">
            <label>User_SRN:</label>
            <input
              type="text"
              value={userid}
              onChange={(e) => setUserID(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="signup-button">
            Sign Up
          </button>
        </form>
        <p>
          Already have an account? <Link to="/login">LogIn</Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
