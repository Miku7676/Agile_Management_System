import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import '../css/Login.css'; // Importing the CSS file for styling

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const location = useLocation();

  // Handle OAuth success redirect
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    if (token) {
      sessionStorage.setItem('token', token);
      navigate('/');
    }
  }, [location, navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    const loginData = { email, password };

    axios
      .post('http://localhost:5000/api/users/login', loginData)
      .then((response) => {
        const token = response.data.token;
        sessionStorage.setItem('token', token);
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

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5000/api/users/auth/google';
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleLogin}>
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
          <button type="submit" className="login-button">Login</button>
        </form>
        
        <div className="oauth-section">
          <button 
            onClick={handleGoogleLogin}
            className="google-login-button"
          >
            Login with Google
          </button>
        </div>

        <p>
          Don't have an account? <Link to="/signup">Register Here</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;