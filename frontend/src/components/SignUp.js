import React, {useState} from 'react'
import axios from 'axios';
import { Link } from 'react-router-dom';

function SignUp() {
    const [userid, setUserID] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');  // New password state
    const [message, setMessage] = useState('');  // For showing success or error messages

    // Handle form submission (signup)
    const handleSignup = (e) => {
        e.preventDefault();

        // Ensure password is also sent to the backend
        const userData = {
        userid,
        username,
        email,
        password,  // Password is now included
        created_at: new Date().toISOString()
    };

    // Send POST request to the backend to create a new user
    axios.post('http://localhost:5000/api/users/signup', userData)
      .then(response => {
        console.log('User created:', response.data);
        setMessage('User successfully created!');  // Show success message
      })
      .catch(error => {
        console.error('Error creating user:', error);
        setMessage('Error creating user. Please try again.');  // Show error message
      });
  };

    return (
    <div>
      <h2>Signup</h2>
      {message && <p>{message}</p>} {/* Display success or error message */}
      <form onSubmit={handleSignup}>
      <div>
          <label>User_SRN:</label>
          <input 
            type="text" 
            value={userid} 
            onChange={(e) => setUserID(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Username:</label>
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
          />
        </div>
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
            onChange={(e) => setPassword(e.target.value)}  // Capture password
            required 
          />
        </div>
        <button type="submit">Signup</button>
      </form>

      <p>Already have an account? <Link to="/login">LogIn</Link></p>
    </div>
  )
}

export default SignUp
