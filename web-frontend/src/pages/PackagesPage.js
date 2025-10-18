import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaClock, FaCheckCircle } from 'react-icons/fa';
import Header from '../components/Header';

const PackagesPage = () => {
  const [selectedPackage, setSelectedPackage] = useState('baby');
  const navigate = useNavigate();

  const babyPackages = [
    {
      id: 'baby-basic',
      type: 'basic',
      name: 'Basic Care',
      price: 6000,
      visits: '2 visits per week',
      duration: '1-2 hours per visit',
      features: [
        'Gentle oil massage',
        'Warm water bath',
        'Basic baby care guidance',
        'Progress tracking'
      ],
      popular: false
    },
    {
      id: 'baby-standard',
      type: 'standard',
      name: 'Standard Care',
      price: 10000,
      visits: '4 visits per week',
      duration: '1-2 hours per visit',
      features: [
        'Gentle oil massage',
        'Warm water bath',
        'Advanced baby care techniques',
        'Development exercises',
        'Progress tracking',
        'WhatsApp support'
      ],
      popular: true
    },
    {
      id: 'baby-premium',
      type: 'premium',
      name: 'Premium Care',
      price: 14000,
      visits: 'Daily visits',
      duration: '1-2 hours per visit',
      features: [
        'Gentle oil massage',
        'Warm water bath',
        'Expert baby care techniques',
        'Development exercises',
        'Sleep training support',
        'Nutrition guidance',
        'Progress tracking',
        '24/7 WhatsApp support'
      ],
      popular: false
    }
  ];

  const motherPackages = [
    {
      id: 'mother-basic',
      type: 'basic',
      name: 'Basic Postpartum Care',
      price: 5000,
      visits: '2 visits per week',
      duration: '1-2 hours per visit',
      features: [
        'Relaxing body massage',
        'Basic postpartum care',
        'Recovery guidance',
        'Progress tracking'
      ],
      popular: false
    },
    {
      id: 'mother-standard',
      type: 'standard',
      name: 'Standard Postpartum Care',
      price: 9000,
      visits: '4 visits per week',
      duration: '1-2 hours per visit',
      features: [
        'Therapeutic body massage',
        'Advanced postpartum care',
        'Recovery guidance',
        'Lactation support',
        'Progress tracking',
        'WhatsApp support'
      ],
      popular: true
    },
    {
      id: 'mother-premium',
      type: 'premium',
      name: 'Premium Postpartum Care',
      price: 12000,
      visits: 'Daily visits',
      duration: '1-2 hours per visit',
      features: [
        'Expert therapeutic massage',
        'Comprehensive postpartum care',
        'Recovery guidance',
        'Lactation support',
        'Nutrition planning',
        'Mental wellness support',
        'Progress tracking',
        '24/7 WhatsApp support'
      ],
      popular: false
    }
  ];

  const currentPackages = selectedPackage === 'baby' ? babyPackages : motherPackages;

  const handleSubscribe = (pkg) => {
    navigate('/customer-signup', {
      state: {
        packageId: pkg.id,
        packageName: pkg.name,
        price: pkg.price,
        packageType: selectedPackage
      }
    });
  };

  return (
    <div className="page-container">
      <Header />
      
      <div className="container py-4">
        <div className="text-center mb-4">
          <h1>Choose Your Care Package</h1>
          <p className="text-muted">Flexible subscription plans designed for newborn and mother care needs</p>
        </div>

        {/* Package Type Selector */}
        <div className="package-selector mb-4">
          <h3 className="text-center mb-3">Select Care Type</h3>
          <div className="selector-buttons">
            <button
              className={`selector-btn ${selectedPackage === 'baby' ? 'active' : ''}`}
              onClick={() => setSelectedPackage('baby')}
            >
              Newborn Baby Care
            </button>
            <button
              className={`selector-btn ${selectedPackage === 'mother' ? 'active' : ''}`}
              onClick={() => setSelectedPackage('mother')}
            >
              Postpartum Mother Care
            </button>
          </div>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-3 mb-4">
          {currentPackages.map((pkg) => (
            <div key={pkg.id} className={`package-card card ${pkg.popular ? 'popular' : ''}`}>
              {pkg.popular && (
                <div className="popular-badge">
                  Most Popular
                </div>
              )}
              
              <div className="text-center mb-3">
                <h3>{pkg.name}</h3>
                <div className="price">
                  <span className="currency">₹</span>
                  <span className="amount">{pkg.price.toLocaleString('en-IN')}</span>
                  <span className="period">/month</span>
                </div>
              </div>
              
              <div className="package-details mb-3">
                <div className="detail-item">
                  <FaCalendarAlt className="detail-icon" />
                  <span>{pkg.visits}</span>
                </div>
                <div className="detail-item">
                  <FaClock className="detail-icon" />
                  <span>{pkg.duration}</span>
                </div>
              </div>
              
              <div className="features mb-4">
                <h4>What's Included:</h4>
                {pkg.features.map((feature, index) => (
                  <div key={index} className="feature-item">
                    <FaCheckCircle className="feature-icon" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              
              <button
                className={`btn ${pkg.popular ? 'btn-primary' : 'btn-secondary'} w-100`}
                onClick={() => handleSubscribe(pkg)}
              >
                Subscribe Now
              </button>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="info-section">
          <div className="card">
            <div className="info-header">
              <h3>📋 Important Notes</h3>
            </div>
            <div className="info-content">
              <ul>
                <li>All plans include professional care from trained specialists</li>
                <li>Service areas: Bangalore & Dharwad, Karnataka</li>
                <li>Payment via UPI or Bank transfer</li>
                <li>Cancel anytime with 7 days notice</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .package-selector {
          max-width: 600px;
          margin: 0 auto;
        }
        
        .selector-buttons {
          display: flex;
          background: white;
          border-radius: 25px;
          padding: 4px;
          box-shadow: var(--shadow);
        }
        
        .selector-btn {
          flex: 1;
          padding: 12px 24px;
          border: none;
          border-radius: 20px;
          background: transparent;
          color: var(--medium-gray);
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .selector-btn.active {
          background: var(--primary-color);
          color: white;
        }
        
        .package-card {
          position: relative;
          padding: 2rem 1.5rem;
          text-align: center;
        }
        
        .package-card.popular {
          border: 2px solid var(--primary-color);
          transform: scale(1.05);
        }
        
        .popular-badge {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          background: var(--primary-color);
          color: white;
          padding: 6px 16px;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 600;
        }
        
        .price {
          margin: 1rem 0;
        }
        
        .currency {
          font-size: 1.2rem;
          color: var(--primary-color);
        }
        
        .amount {
          font-size: 2.5rem;
          font-weight: bold;
          color: var(--primary-color);
        }
        
        .period {
          color: var(--medium-gray);
          font-size: 1rem;
        }
        
        .package-details {
          display: flex;
          justify-content: space-around;
          background: var(--light-gray);
          padding: 1rem;
          border-radius: var(--border-radius);
        }
        
        .detail-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .detail-icon {
          color: var(--primary-color);
        }
        
        .features {
          text-align: left;
        }
        
        .features h4 {
          margin-bottom: 1rem;
          color: var(--secondary-color);
        }
        
        .feature-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }
        
        .feature-icon {
          color: var(--accent-color);
          font-size: 0.9rem;
        }
        
        .w-100 {
          width: 100%;
        }
        
        .info-section {
          max-width: 600px;
          margin: 0 auto;
        }
        
        .info-header {
          display: flex;
          align-items: center;
          margin-bottom: 1rem;
        }
        
        .info-content ul {
          list-style: none;
          padding: 0;
        }
        
        .info-content li {
          padding: 0.5rem 0;
          border-bottom: 1px solid var(--border-color);
        }
        
        .info-content li:last-child {
          border-bottom: none;
        }
        
        .info-content li::before {
          content: "• ";
          color: var(--primary-color);
          font-weight: bold;
        }
        
        @media (max-width: 768px) {
          .selector-buttons {
            flex-direction: column;
          }
          
          .package-card.popular {
            transform: none;
            margin: 1rem 0;
          }
          
          .package-details {
            flex-direction: column;
            gap: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default PackagesPage;