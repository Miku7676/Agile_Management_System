import React, { useState } from 'react';
import axios from 'axios';
// import { Link } from 'react-router-dom';
import '../css/SignUp.css';  // Importing the CSS file for styling
import { Link, useNavigate } from 'react-router-dom';
// import { useGoogleLogin } from '@react-oauth/google'

const SignUp = () => {
  const [formData, setFormData] = useState({
    userid: '',
    username: '',
    email: '',
    password: ''
  });
  const [message, setMessage] = useState({ type: '', content: '' });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await axios.post('http://localhost:5000/api/users/signup',  {
          ...formData,
          created_at: new Date().toISOString(),
        }) //.then(()=>{navigate('/login')})
        .then(()=>{
          setMessage({ type: 'success', content: 'User successfully created!' });
          navigate('/login')
        })
        .catch((error)=>{
          // console.log('hi',error);
          if (error.response.data.errno === 1062) {
            setMessage({ type: 'error', content: 'USERID already exists' })
          }
        })

    } catch (error) {
      throw new Error('error creating user')
    } finally {
      setIsLoading(false);
    }
  };

  // const googleSuccess = async (res)=> {
  //   try {
  //       const newRes = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo",
  //           {
  //               headers: {
  //                   Authorization: `Bearer ${res?.access_token}`,
  //               },
  //           }
  //       );
  //       // console.log(res.access_token);
  //       const token = res?.access_token;
  //       const result = newRes?.data;
  //       console.log(result, token);

  //       // dispatch({type: 'AUTH', data: {result,token}});
  //       // navigate('/')
  //   } catch (error) {
  //       console.log(error)
  //   }
  // }
  // const googleFailure= (error)=> {
  //     console.log(error)
  //     console.log("Google Sign In was unuccessful");
  // }
  // const handleGoogleSignup = useGoogleLogin({
  //   onSuccess: googleSuccess,
  //   onError: googleFailure
  // });


  return (
    <div className="signup-container">
      <div className="signup-box">
        <header className="signup-header">
          <h2 className="signup-title">Create an Account</h2>
          <p className="signup-description">
            Sign up using your email or continue with social accounts
          </p>
        </header>

        <div className="signup-content">
          {message.content && (
            <div className={`alert ${message.type === 'error' ? 'alert-error' : 'alert-success'}`}>
              <p>{message.content}</p>
            </div>
          )}

          <form onSubmit={handleSignup} className="form-group">
            <div className="form-group">
              <label className="form-label" htmlFor="userid">User SRN</label>
              <input
                id="userid"
                name="userid"
                type="text"
                value={formData.userid}
                onChange={handleInputChange}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="username">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleInputChange}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="form-input"
              />
            </div>

            <button 
              type="submit" 
              className="signup-button"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Sign Up'}                       
            </button>
          </form>

          {/* <div className="divider">
            <span className="divider-text">Or continue with</span>
          </div> */}

          {/* <div className="oauth-buttons">
            <button 
              className="oauth-button" 
              onClick={handleGoogleSignup}
              type="button"
            >
              Google
            </button>
          </div> */}
        </div>

        <footer className="signup-footer">
          <p className="signup-footer-text">
            Already have an account?{' '}
            <Link 
              to='/login'
              className="signup-footer-link"
            >
              Log In
            </Link>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default SignUp;
