import React, { useState, useEffect } from 'react';
import './App.css';
import Dashboard from './Dashboard';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

const App = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [profileData, setProfileData] = useState(null);
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Check if token exists on initial load to maintain session
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const endpoint = isLoginMode ? `${API_BASE_URL}/api/login` : `${API_BASE_URL}/api/register`;
    
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        if (isLoginMode) {
          // Login successful
          localStorage.setItem('token', data.token);
          setIsLoggedIn(true);
          setUserEmail(data.email);
          setProfileData(null);
        } else {
          setSuccess('Registration successful! Please sign in.');
          setIsLoginMode(true); 
          setPassword(''); 
        }
      } else {
        setError(data.error || `${isLoginMode ? 'Login' : 'Registration'} failed`);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUserEmail('');
    setProfileData(null);
    setEmail('');
    setPassword('');
    setError('');
    setSuccess('');
  };

  const fetchProtectedProfile = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setError('No token found, please log in first');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (response.ok) {
        setProfileData(data);
      } else {
        if (response.status === 401 || response.status === 403) {
          handleLogout();
        }
        setError(data.error || 'Failed to fetch profile');
      }
    } catch (err) {
      setError('An error occurred while fetching profile');
    }
  };

  const toggleMode = () => {
    setIsLoginMode((prev) => !prev);
    setError('');
    setSuccess('');
    setPassword('');
  };

  // Dashboard View
  if (isLoggedIn) {
    return <Dashboard userEmail={userEmail} onLogout={handleLogout} />;
  }

  // Auth View (Login / Register)
  return (
    <div className="page-container">
      <div className="card auth-card fade-in">
        <div className="card-header">
          <h2 className="title">{isLoginMode ? 'Welcome Back' : 'Create an Account'}</h2>
          <p className="subtitle">
            {isLoginMode 
              ? 'Enter your credentials to access your account.' 
              : 'Sign up to get started with our platform.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="name@example.com"
              className="form-input"
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="form-input"
            />
          </div>

          {error && <div className="alert alert-error slide-down">{error}</div>}
          {success && <div className="alert alert-success slide-down">{success}</div>}

          <button type="submit" className="btn btn-primary btn-block">
            {isLoginMode ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className="card-footer">
          <button type="button" onClick={toggleMode} className="btn-link">
            {isLoginMode 
              ? "Don't have an account? Sign Up" 
              : "Already have an account? Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
