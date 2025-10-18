import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUsers, FaCalendarAlt, FaCheckCircle, FaStar, FaChartLine } from 'react-icons/fa';
import Header from '../components/Header';

const TeamLogin = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!loginData.email || !loginData.password) {
      alert('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: loginData.email,
          password: loginData.password
        })
      });

      const result = await response.json();

      if (response.ok && result.user.role === 'team_member') {
        alert(`Welcome, ${result.user.name}!`);
        navigate('/team-dashboard', {
          state: { 
            teamMemberId: result.user.id, 
            teamMemberName: result.user.name 
          }
        });
      } else if (response.ok && result.user.role !== 'team_member') {
        alert('This login is only for team members. Please use the correct login page.');
      } else {
        alert(result.detail || 'Invalid credentials');
      }
    } catch (error) {
      alert('Network error. Please try again.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container">
      <Header />
      
      <div className="container py-4">
        <div className="login-container">
          {/* Welcome Section */}
          <div className="welcome-section text-center mb-4">
            <div className="welcome-icon">
              <FaUsers />
            </div>
            <h1>Welcome Back!</h1>
            <p className="text-muted">
              Sign in to access your visit schedule and log your service activities.
            </p>
          </div>

          {/* Login Form */}
          <div className="form-container card mb-4">
            <h2 className="text-center mb-3">Team Member Access</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  placeholder="Enter your team email"
                  value={loginData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  name="password"
                  className="form-input"
                  placeholder="Enter your password"
                  value={loginData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn w-100 mb-3"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>

              <div className="text-center">
                <a href="#" className="link-btn">Forgot Password?</a>
              </div>
            </form>
          </div>

          {/* Features Section */}
          <div className="features-section card mb-4">
            <h3 className="text-center mb-3">What you can do:</h3>
            
            <div className="features-list">
              <div className="feature-item">
                <FaCalendarAlt className="feature-icon" />
                <span>View your visit schedule</span>
              </div>
              
              <div className="feature-item">
                <FaCheckCircle className="feature-icon" />
                <span>Log service visits</span>
              </div>
              
              <div className="feature-item">
                <FaStar className="feature-icon" />
                <span>View customer feedback</span>
              </div>
              
              <div className="feature-item">
                <FaChartLine className="feature-icon" />
                <span>Track performance metrics</span>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="contact-section card">
            <h3 className="text-center mb-2">Need Access?</h3>
            <p className="text-center text-muted mb-3">
              If you're a new team member and don't have login credentials, please contact the admin.
            </p>
            
            <div className="text-center">
              <a href="tel:+919740517671" className="btn btn-secondary">
                <FaUsers /> Contact Admin
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .login-container {
          max-width: 500px;
          margin: 0 auto;
        }
        
        .welcome-section {
          padding: 2rem 0;
        }
        
        .welcome-icon {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, var(--primary-color), #357abd);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
          font-size: 2rem;
          color: white;
        }
        
        .welcome-section h1 {
          margin-bottom: 0.5rem;
          color: var(--secondary-color);
        }
        
        .form-container {
          padding: 2rem;
        }
        
        .link-btn {
          color: var(--primary-color);
          text-decoration: none;
        }
        
        .link-btn:hover {
          text-decoration: underline;
        }
        
        .features-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .feature-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem;
          background: var(--light-gray);
          border-radius: var(--border-radius);
        }
        
        .feature-icon {
          color: var(--primary-color);
          font-size: 1.2rem;
        }
        
        .contact-section {
          text-align: center;
        }
        
        .w-100 {
          width: 100%;
        }
      `}</style>
    </div>
  );
};

export default TeamLogin;