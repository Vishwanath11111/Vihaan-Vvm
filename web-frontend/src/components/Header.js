import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            Vihaan Care Nest
          </Link>
          
          <nav className="nav">
            <Link 
              to="/packages" 
              className={`nav-link ${location.pathname === '/packages' ? 'active' : ''}`}
            >
              Packages
            </Link>
            <Link 
              to="/customer-login" 
              className={`nav-link ${location.pathname === '/customer-login' ? 'active' : ''}`}
            >
              Customer Login
            </Link>
            <Link 
              to="/team-login" 
              className={`nav-link ${location.pathname === '/team-login' ? 'active' : ''}`}
            >
              Team Login
            </Link>
            <Link 
              to="/admin-login" 
              className={`nav-link ${location.pathname === '/admin-login' ? 'active' : ''}`}
            >
              Admin
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;