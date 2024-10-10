import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    const loginData = {
      email,
      password,
    };

    axios
      .post('http://localhost:5000/api/users/login', loginData)
      .then((response) => {
        const token = response.data.token;
        console.log('Login successful:', response.data);

        // Store the token in localStorage
        localStorage.setItem('token', token);

        // Redirect the user to the dashboard
        navigate('/');
      })
      .catch((error) => {
        if (error.response && error.response.data.error) {
          setError(error.response.data.error);
        } else {
          setError('An unexpected error occurred. Please try again later.');
        }
      });
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account? <Link to="/signup">Register Here</Link>
      </p>
    </div>
  );
}

export default Login;
