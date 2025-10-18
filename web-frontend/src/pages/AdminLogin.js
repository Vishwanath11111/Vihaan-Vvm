import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShieldAlt, FaChartBar, FaUsers, FaUser, FaCalendarAlt, FaCreditCard, FaCogs, FaLock } from 'react-icons/fa';
import Header from '../components/Header';

const AdminLogin = () => {
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

      if (response.ok && result.user.role === 'admin') {
        alert(`Welcome Admin, ${result.user.name}!`);
        navigate('/admin-dashboard', {
          state: { 
            adminId: result.user.id, 
            adminName: result.user.name 
          }
        });
      } else if (response.ok && result.user.role !== 'admin') {
        alert('This login is only for administrators. Please use the correct login page.');
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
              <FaShieldAlt />
            </div>
            <h1>Admin Access</h1>
            <p className="text-muted">
              Secure administrator login for Vihaan Care Nest management system.
            </p>
          </div>

          {/* Login Form */}
          <div className="form-container card mb-4">
            <h2 className="text-center mb-3">Administrator Login</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Admin Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  placeholder="Enter admin email"
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
                  placeholder="Enter admin password"
                  value={loginData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-danger w-100 mb-3"
                disabled={isLoading}
              >
                {isLoading ? 'Authenticating...' : 'Access Dashboard'}
              </button>

              <div className="text-center">
                <a href="#" className="link-btn">Forgot Admin Password?</a>
              </div>
            </form>
          </div>

          {/* Features Section */}
          <div className="features-section card mb-4">
            <h3 className="text-center mb-3">Admin Dashboard Features</h3>
            
            <div className="features-grid">
              <div className="feature-item">
                <FaChartBar className="feature-icon" />
                <span>Business Analytics & Reports</span>
              </div>
              
              <div className="feature-item">
                <FaUsers className="feature-icon" />
                <span>Team Member Management</span>
              </div>
              
              <div className="feature-item">
                <FaUser className="feature-icon" />
                <span>Customer Management</span>
              </div>
              
              <div className="feature-item">
                <FaCalendarAlt className="feature-icon" />
                <span>Visit Scheduling & Assignment</span>
              </div>
              
              <div className="feature-item">
                <FaCreditCard className="feature-icon" />
                <span>Subscription & Payment Tracking</span>
              </div>
              
              <div className="feature-item">
                <FaCogs className="feature-icon" />
                <span>System Configuration</span>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="security-section card">
            <div className="security-header">
              <FaLock className="security-icon" />
              <h3>Security Notice</h3>
            </div>
            <p className="text-muted text-center">
              This is a restricted area. Only authorized administrators should access this panel. 
              All activities are logged and monitored for security purposes.
            </p>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .login-container {
          max-width: 600px;
          margin: 0 auto;
        }
        
        .welcome-section {
          padding: 2rem 0;
        }
        
        .welcome-icon {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, var(--danger-color), #c0392b);
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
          border-left: 4px solid var(--danger-color);
        }
        
        .link-btn {
          color: var(--danger-color);
          text-decoration: none;
        }
        
        .link-btn:hover {
          text-decoration: underline;
        }
        
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
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
          color: var(--danger-color);
          font-size: 1.2rem;
        }
        
        .security-section {
          background: #fff9e6;
          border: 1px solid var(--warning-color);
          text-align: center;
        }
        
        .security-header {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }
        
        .security-icon {
          color: var(--warning-color);
          font-size: 1.5rem;
        }
        
        .security-header h3 {
          color: var(--warning-color);
          margin: 0;
        }
        
        .w-100 {
          width: 100%;
        }
        
        @media (max-width: 600px) {
          .features-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminLogin;