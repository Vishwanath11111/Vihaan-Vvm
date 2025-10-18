import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FaCalendarAlt, FaCreditCard, FaStar, FaUser, FaHome } from 'react-icons/fa';
import Header from '../components/Header';

const CustomerDashboard = () => {
  const location = useLocation();
  const customerInfo = location.state;
  const [subscriptions, setSubscriptions] = useState([]);
  const [visits, setVisits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (customerInfo?.customerId) {
      fetchCustomerData();
    }
  }, [customerInfo]);

  const fetchCustomerData = async () => {
    try {
      // Fetch subscriptions
      const subsResponse = await fetch(`/api/subscriptions/customer/${customerInfo.customerId}`);
      if (subsResponse.ok) {
        const subsData = await subsResponse.json();
        setSubscriptions(subsData);
      }

      // Fetch visits
      const visitsResponse = await fetch(`/api/visits/customer/${customerInfo.customerId}`);
      if (visitsResponse.ok) {
        const visitsData = await visitsResponse.json();
        setVisits(visitsData);
      }
    } catch (error) {
      console.error('Error fetching customer data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const rateVisit = async (visitId, rating, review) => {
    try {
      const response = await fetch(`/api/visits/${visitId}/rate`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating, review })
      });

      if (response.ok) {
        alert('Thank you for your rating!');
        fetchCustomerData(); // Refresh data
      }
    } catch (error) {
      alert('Error submitting rating');
    }
  };

  if (!customerInfo) {
    return (
      <div className="page-container">
        <Header />
        <div className="container py-4 text-center">
          <h2>Please Login</h2>
          <p>You need to login to access your dashboard.</p>
          <Link to="/customer-login" className="btn">Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Header />
      
      <div className="container py-4">
        <div className="dashboard-header mb-4">
          <div className="welcome-section">
            <h1>Welcome back, {customerInfo.customerName}!</h1>
            <p className="text-muted">Manage your subscriptions and track your care services</p>
          </div>
          <Link to="/" className="btn btn-secondary">
            <FaHome /> Home
          </Link>
        </div>

        {isLoading ? (
          <div className="text-center py-4">
            <p>Loading your dashboard...</p>
          </div>
        ) : (
          <div className="dashboard-content">
            {/* Quick Stats */}
            <div className="stats-grid mb-4">
              <div className="stat-card card">
                <div className="stat-icon">
                  <FaCreditCard />
                </div>
                <div className="stat-content">
                  <h3>{subscriptions.length}</h3>
                  <p>Active Subscriptions</p>
                </div>
              </div>
              
              <div className="stat-card card">
                <div className="stat-icon">
                  <FaCalendarAlt />
                </div>
                <div className="stat-content">
                  <h3>{visits.length}</h3>
                  <p>Total Visits</p>
                </div>
              </div>
              
              <div className="stat-card card">
                <div className="stat-icon">
                  <FaStar />
                </div>
                <div className="stat-content">
                  <h3>{visits.filter(v => v.customer_rating).length}</h3>
                  <p>Rated Visits</p>
                </div>
              </div>
            </div>

            <div className="grid grid-2">
              {/* Subscriptions */}
              <div className="section-card card">
                <h3>Your Subscriptions</h3>
                {subscriptions.length === 0 ? (
                  <div className="empty-state">
                    <p>No active subscriptions</p>
                    <Link to="/packages" className="btn">View Packages</Link>
                  </div>
                ) : (
                  <div className="subscriptions-list">
                    {subscriptions.map((sub) => (
                      <div key={sub.id} className="subscription-item">
                        <div className="subscription-header">
                          <h4>Subscription #{sub.id.slice(-6)}</h4>
                          <span className={`status ${sub.status}`}>{sub.status}</span>
                        </div>
                        <div className="subscription-details">
                          <p><strong>Amount:</strong> ₹{sub.monthly_amount.toLocaleString('en-IN')}/month</p>
                          <p><strong>Start Date:</strong> {new Date(sub.start_date).toLocaleDateString()}</p>
                          <p><strong>End Date:</strong> {new Date(sub.end_date).toLocaleDateString()}</p>
                          <p><strong>Payment Status:</strong> {sub.payment_status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Visits */}
              <div className="section-card card">
                <h3>Recent Visits</h3>
                {visits.length === 0 ? (
                  <div className="empty-state">
                    <p>No visits scheduled yet</p>
                    <p className="text-muted">Our team will contact you soon!</p>
                  </div>
                ) : (
                  <div className="visits-list">
                    {visits.slice(0, 5).map((visit) => (
                      <div key={visit.id} className="visit-item">
                        <div className="visit-header">
                          <h4>{new Date(visit.scheduled_date).toLocaleDateString()}</h4>
                          <span className={`status ${visit.status}`}>{visit.status}</span>
                        </div>
                        <div className="visit-details">
                          <p><strong>Time:</strong> {new Date(visit.scheduled_date).toLocaleTimeString()}</p>
                          {visit.status === 'completed' && !visit.customer_rating && (
                            <div className="rating-section">
                              <p>Rate this visit:</p>
                              <div className="rating-buttons">
                                {[1, 2, 3, 4, 5].map(rating => (
                                  <button
                                    key={rating}
                                    className="rating-btn"
                                    onClick={() => {
                                      const review = prompt('Please leave a review (optional):');
                                      rateVisit(visit.id, rating, review || '');
                                    }}
                                  >
                                    {rating} ⭐
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                          {visit.customer_rating && (
                            <div className="visit-rating">
                              <p><strong>Your Rating:</strong> {visit.customer_rating} ⭐</p>
                              {visit.customer_review && (
                                <p><strong>Your Review:</strong> {visit.customer_review}</p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      
      <style jsx>{`
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 1rem;
        }
        
        .welcome-section h1 {
          color: var(--secondary-color);
          margin-bottom: 0.5rem;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }
        
        .stat-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem;
        }
        
        .stat-icon {
          width: 50px;
          height: 50px;
          background: var(--primary-color);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.5rem;
        }
        
        .stat-content h3 {
          font-size: 2rem;
          font-weight: bold;
          color: var(--primary-color);
          margin: 0;
        }
        
        .stat-content p {
          color: var(--medium-gray);
          margin: 0;
        }
        
        .section-card {
          padding: 2rem;
        }
        
        .section-card h3 {
          margin-bottom: 1.5rem;
          color: var(--secondary-color);
        }
        
        .empty-state {
          text-align: center;
          padding: 2rem;
          color: var(--medium-gray);
        }
        
        .subscription-item,
        .visit-item {
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius);
          padding: 1rem;
          margin-bottom: 1rem;
        }
        
        .subscription-header,
        .visit-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }
        
        .subscription-header h4,
        .visit-header h4 {
          margin: 0;
          color: var(--secondary-color);
        }
        
        .status {
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
        }
        
        .status.active {
          background: #d4edda;
          color: #155724;
        }
        
        .status.completed {
          background: #d4edda;
          color: #155724;
        }
        
        .status.scheduled {
          background: #d1ecf1;
          color: #0c5460;
        }
        
        .status.pending {
          background: #fff3cd;
          color: #856404;
        }
        
        .subscription-details,
        .visit-details {
          color: var(--dark-gray);
        }
        
        .subscription-details p,
        .visit-details p {
          margin-bottom: 0.5rem;
        }
        
        .rating-section {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid var(--border-color);
        }
        
        .rating-buttons {
          display: flex;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }
        
        .rating-btn {
          padding: 0.5rem 1rem;
          border: 1px solid var(--primary-color);
          background: white;
          color: var(--primary-color);
          border-radius: var(--border-radius);
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .rating-btn:hover {
          background: var(--primary-color);
          color: white;
        }
        
        .visit-rating {
          margin-top: 0.5rem;
          padding-top: 0.5rem;
          border-top: 1px solid var(--border-color);
        }
        
        @media (max-width: 768px) {
          .dashboard-header {
            flex-direction: column;
            align-items: stretch;
          }
          
          .stats-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default CustomerDashboard;