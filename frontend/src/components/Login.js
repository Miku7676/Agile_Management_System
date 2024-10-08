import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    const loginData = {
      email,
      password
    };

    axios.post('http://localhost:5000/api/users/login', loginData)
      .then(response => {
        console.log('Login successful:', response.data);
        // Optionally, store token or user info in state/local storage and redirect
      })
      .catch(error => {
        // Show alert for errors
        if (error.response && error.response.data.error) {
          alert(error.response.data.error);
        } else {
          alert('An unexpected error occurred. Please try again later.');
        }
      });
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit">Login</button>
      </form>
      <p>Don't have an account? <Link to="/users">Register Here</Link></p>
    </div>
  );
}

export default Login;