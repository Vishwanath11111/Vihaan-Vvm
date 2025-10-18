import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaCalendarAlt, FaCreditCard, FaStar, FaCommentAlt } from 'react-icons/fa';
import Header from '../components/Header';

const CustomerLogin = () => {
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

      if (response.ok && result.user.role === 'customer') {
        alert(`Welcome back, ${result.user.name}!`);
        navigate('/customer-dashboard', {
          state: { 
            customerId: result.user.id, 
            customerName: result.user.name 
          }
        });
      } else if (response.ok && result.user.role !== 'customer') {
        alert('This login is only for customers. Please use the correct login page.');
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
              <FaUser />
            </div>
            <h1>Welcome Back!</h1>
            <p className="text-muted">
              Access your subscriptions, view visit history, and manage your care services.
            </p>
          </div>

          {/* Login Form */}
          <div className="form-container card mb-4">
            <h2 className="text-center mb-3">Customer Login</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  placeholder="Enter your email"
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
            
            <div className="signup-section">
              <p className="text-center text-muted">Don't have an account?</p>
              <div className="text-center">
                <Link to="/packages" className="link-btn">
                  Choose a package to get started
                </Link>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="features-section card">
            <h3 className="text-center mb-3">Your Dashboard Features</h3>
            
            <div className="features-grid">
              <div className="feature-item">
                <FaCalendarAlt className="feature-icon" />
                <span>View upcoming visits</span>
              </div>
              
              <div className="feature-item">
                <FaCreditCard className="feature-icon" />
                <span>Manage subscriptions</span>
              </div>
              
              <div className="feature-item">
                <FaStar className="feature-icon" />
                <span>Rate your care providers</span>
              </div>
              
              <div className="feature-item">
                <FaCommentAlt className="feature-icon" />
                <span>Contact support</span>
              </div>
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
        
        .signup-section {
          border-top: 1px solid var(--border-color);
          margin-top: 1.5rem;
          padding-top: 1.5rem;
        }
        
        .link-btn {
          color: var(--primary-color);
          text-decoration: none;
        }
        
        .link-btn:hover {
          text-decoration: underline;
        }
        
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }
        
        .feature-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          background: var(--light-gray);
          border-radius: var(--border-radius);
        }
        
        .feature-icon {
          color: var(--primary-color);
          font-size: 1.2rem;
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

export default CustomerLogin;