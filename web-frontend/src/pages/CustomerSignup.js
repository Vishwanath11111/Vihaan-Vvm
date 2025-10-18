import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Header from '../components/Header';

const CustomerSignup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const packageInfo = location.state;
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: '',
    city: 'Bangalore'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isLogin) {
      if (formData.password !== formData.confirmPassword) {
        alert('Passwords do not match');
        return;
      }
      if (formData.password.length < 6) {
        alert('Password must be at least 6 characters');
        return;
      }
    }

    setIsLoading(true);
    
    try {
      const endpoint = isLogin ? '/api/users/login' : '/api/users';
      const payload = isLogin ? {
        email: formData.email,
        password: formData.password
      } : {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: 'customer',
        address: formData.address,
        city: formData.city
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok) {
        const userId = isLogin ? result.user.id : result.id;
        const userName = isLogin ? result.user.name : result.name;
        
        if (isLogin && result.user.role !== 'customer') {
          alert('This login is only for customers. Please use the correct login page.');
          return;
        }
        
        alert(isLogin ? 'Login successful!' : 'Account created successfully!');
        
        navigate('/payment', {
          state: {
            customerId: userId,
            customerName: userName,
            ...packageInfo
          }
        });
      } else {
        alert(result.detail || 'An error occurred');
      }
    } catch (error) {
      alert('Network error. Please try again.');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!packageInfo) {
    return (
      <div className="page-container">
        <Header />
        <div className="container py-4 text-center">
          <h2>No Package Selected</h2>
          <p>Please select a package first.</p>
          <Link to="/packages" className="btn">View Packages</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Header />
      
      <div className="container py-4">
        <div className="signup-container">
          {/* Package Info */}
          <div className="package-info card mb-4">
            <h3>Selected Package</h3>
            <div className="package-details">
              <h4>{packageInfo.packageName}</h4>
              <div className="price">₹{packageInfo.price?.toLocaleString('en-IN')}/month</div>
              <div className="package-type">
                {packageInfo.packageType === 'baby' ? 'Newborn Baby Care' : 'Postpartum Mother Care'}
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="form-container card">
            <h2 className="text-center mb-3">
              {isLogin ? 'Login to Continue' : 'Create Your Account'}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  placeholder="Enter your email"
                  value={formData.email}
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
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {!isLogin && (
                <>
                  <div className="form-group">
                    <label className="form-label">Confirm Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      className="form-input"
                      placeholder="Confirm password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      className="form-input"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      className="form-input"
                      placeholder="Enter phone number"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Address</label>
                    <textarea
                      name="address"
                      className="form-input form-textarea"
                      placeholder="Enter your full address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">City</label>
                    <div className="city-selector">
                      <button
                        type="button"
                        className={`city-btn ${formData.city === 'Bangalore' ? 'active' : ''}`}
                        onClick={() => setFormData(prev => ({...prev, city: 'Bangalore'}))}
                      >
                        Bangalore
                      </button>
                      <button
                        type="button"
                        className={`city-btn ${formData.city === 'Dharwad' ? 'active' : ''}`}
                        onClick={() => setFormData(prev => ({...prev, city: 'Dharwad'}))}
                      >
                        Dharwad
                      </button>
                    </div>
                  </div>
                </>
              )}

              <button
                type="submit"
                className="btn w-100"
                disabled={isLoading}
              >
                {isLoading ? 'Please wait...' : (isLogin ? 'Login & Continue' : 'Create Account & Continue')}
              </button>

              <div className="text-center mt-3">
                <button
                  type="button"
                  className="link-btn"
                  onClick={() => setIsLogin(!isLogin)}
                >
                  {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .signup-container {
          max-width: 600px;
          margin: 0 auto;
        }
        
        .package-info {
          text-align: center;
          background: linear-gradient(135deg, var(--primary-color), #357abd);
          color: white;
        }
        
        .package-details h4 {
          margin-bottom: 0.5rem;
        }
        
        .price {
          font-size: 1.5rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
        }
        
        .package-type {
          opacity: 0.9;
        }
        
        .form-container {
          padding: 2rem;
        }
        
        .city-selector {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        
        .city-btn {
          padding: 12px 20px;
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius);
          background: var(--light-gray);
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .city-btn.active {
          background: var(--primary-color);
          color: white;
          border-color: var(--primary-color);
        }
        
        .link-btn {
          background: none;
          border: none;
          color: var(--primary-color);
          cursor: pointer;
          text-decoration: underline;
        }
        
        .w-100 {
          width: 100%;
        }
      `}</style>
    </div>
  );
};

export default CustomerSignup;