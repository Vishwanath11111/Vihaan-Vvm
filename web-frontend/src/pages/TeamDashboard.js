import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FaCalendarAlt, FaCheckCircle, FaStar, FaUser, FaHome, FaClock } from 'react-icons/fa';
import Header from '../components/Header';

const TeamDashboard = () => {
  const location = useLocation();
  const teamInfo = location.state;
  const [visits, setVisits] = useState([]);
  const [performance, setPerformance] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (teamInfo?.teamMemberId) {
      fetchTeamData();
    }
  }, [teamInfo]);

  const fetchTeamData = async () => {
    try {
      // Fetch visits
      const visitsResponse = await fetch(`/api/visits/team-member/${teamInfo.teamMemberId}`);
      if (visitsResponse.ok) {
        const visitsData = await visitsResponse.json();
        setVisits(visitsData);
      }

      // Fetch performance
      const perfResponse = await fetch(`/api/team-members/${teamInfo.teamMemberId}/performance`);
      if (perfResponse.ok) {
        const perfData = await perfResponse.json();
        setPerformance(perfData);
      }
    } catch (error) {
      console.error('Error fetching team data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const logVisit = async (visitId) => {
    const services = prompt('Enter services provided (comma-separated):');
    const notes = prompt('Enter any notes about the visit:');
    
    if (services) {
      try {
        const response = await fetch(`/api/visits/${visitId}/log`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            start_time: new Date().toISOString(),
            end_time: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours later
            services_provided: services.split(',').map(s => s.trim()),
            notes: notes || ''
          })
        });

        if (response.ok) {
          alert('Visit logged successfully!');
          fetchTeamData(); // Refresh data
        }
      } catch (error) {
        alert('Error logging visit');
      }
    }
  };

  if (!teamInfo) {
    return (
      <div className="page-container">
        <Header />
        <div className="container py-4 text-center">
          <h2>Please Login</h2>
          <p>You need to login to access your dashboard.</p>
          <Link to="/team-login" className="btn">Login</Link>
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
            <h1>Welcome, {teamInfo.teamMemberName}!</h1>
            <p className="text-muted">Manage your visits and track your performance</p>
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
            {/* Performance Stats */}
            {performance && (
              <div className="stats-grid mb-4">
                <div className="stat-card card">
                  <div className="stat-icon">
                    <FaCheckCircle />
                  </div>
                  <div className="stat-content">
                    <h3>{performance.total_visits}</h3>
                    <p>Total Visits</p>
                  </div>
                </div>
                
                <div className="stat-card card">
                  <div className="stat-icon">
                    <FaStar />
                  </div>
                  <div className="stat-content">
                    <h3>{performance.average_rating.toFixed(1)}</h3>
                    <p>Average Rating</p>
                  </div>
                </div>
                
                <div className="stat-card card">
                  <div className="stat-icon">
                    <FaUser />
                  </div>
                  <div className="stat-content">
                    <h3>{performance.total_reviews}</h3>
                    <p>Customer Reviews</p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-2">
              {/* Today's Visits */}
              <div className="section-card card">
                <h3>Today's Schedule</h3>
                {visits.filter(v => {
                  const today = new Date().toDateString();
                  const visitDate = new Date(v.scheduled_date).toDateString();
                  return today === visitDate;
                }).length === 0 ? (
                  <div className="empty-state">
                    <p>No visits scheduled for today</p>
                  </div>
                ) : (
                  <div className="visits-list">
                    {visits.filter(v => {
                      const today = new Date().toDateString();
                      const visitDate = new Date(v.scheduled_date).toDateString();
                      return today === visitDate;
                    }).map((visit) => (
                      <div key={visit.id} className="visit-item">
                        <div className="visit-header">
                          <h4>{new Date(visit.scheduled_date).toLocaleTimeString()}</h4>
                          <span className={`status ${visit.status}`}>{visit.status}</span>
                        </div>
                        <div className="visit-details">
                          <p><strong>Customer ID:</strong> {visit.customer_id.slice(-6)}</p>
                          <p><strong>Subscription:</strong> {visit.subscription_id.slice(-6)}</p>
                          {visit.status === 'scheduled' && (
                            <button
                              className="btn btn-success mt-2"
                              onClick={() => logVisit(visit.id)}
                            >
                              Log Visit
                            </button>
                          )}
                          {visit.status === 'completed' && visit.services_provided && (
                            <div className="completed-info">
                              <p><strong>Services:</strong> {visit.services_provided.join(', ')}</p>
                              {visit.notes && <p><strong>Notes:</strong> {visit.notes}</p>}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* All Visits */}
              <div className="section-card card">
                <h3>All Visits</h3>
                {visits.length === 0 ? (
                  <div className="empty-state">
                    <p>No visits assigned yet</p>
                  </div>
                ) : (
                  <div className="visits-list">
                    {visits.slice(0, 10).map((visit) => (
                      <div key={visit.id} className="visit-item">
                        <div className="visit-header">
                          <h4>{new Date(visit.scheduled_date).toLocaleDateString()}</h4>
                          <span className={`status ${visit.status}`}>{visit.status}</span>
                        </div>
                        <div className="visit-details">
                          <p><strong>Time:</strong> {new Date(visit.scheduled_date).toLocaleTimeString()}</p>
                          <p><strong>Customer ID:</strong> {visit.customer_id.slice(-6)}</p>
                          {visit.customer_rating && (
                            <div className="rating-received">
                              <p><strong>Rating:</strong> {visit.customer_rating} ⭐</p>
                              {visit.customer_review && (
                                <p><strong>Review:</strong> {visit.customer_review}</p>
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

            {/* Recent Reviews */}
            {performance && performance.recent_reviews.length > 0 && (
              <div className="section-card card mt-4">
                <h3>Recent Customer Reviews</h3>
                <div className="reviews-list">
                  {performance.recent_reviews.map((review, index) => (
                    <div key={index} className="review-item">
                      <div className="review-header">
                        <div className="review-rating">
                          {[...Array(review.rating)].map((_, i) => (
                            <span key={i} className="star">⭐</span>
                          ))}
                        </div>
                        <span className="review-date">
                          {new Date(review.date).toLocaleDateString()}
                        </span>
                      </div>
                      {review.review && (
                        <p className="review-text">"{review.review}"</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
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
        
        .visit-item {
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius);
          padding: 1rem;
          margin-bottom: 1rem;
        }
        
        .visit-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }
        
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
        
        .status.completed {
          background: #d4edda;
          color: #155724;
        }
        
        .status.scheduled {
          background: #d1ecf1;
          color: #0c5460;
        }
        
        .visit-details {
          color: var(--dark-gray);
        }
        
        .visit-details p {
          margin-bottom: 0.5rem;
        }
        
        .completed-info,
        .rating-received {
          margin-top: 0.75rem;
          padding-top: 0.75rem;
          border-top: 1px solid var(--border-color);
        }
        
        .review-item {
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius);
          padding: 1rem;
          margin-bottom: 1rem;
          background: #f8f9fa;
        }
        
        .review-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }
        
        .review-rating {
          display: flex;
          gap: 2px;
        }
        
        .review-date {
          color: var(--medium-gray);
          font-size: 0.9rem;
        }
        
        .review-text {
          font-style: italic;
          color: var(--dark-gray);
          margin: 0;
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

export default TeamDashboard;