import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FaUsers, FaUser, FaCreditCard, FaCalendarAlt, FaHome, FaChartBar } from 'react-icons/fa';
import Header from '../components/Header';

const AdminDashboard = () => {
  const location = useLocation();
  const adminInfo = location.state;
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/admin/dashboard');
      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!adminInfo) {
    return (
      <div className="page-container">
        <Header />
        <div className="container py-4 text-center">
          <h2>Please Login</h2>
          <p>You need to login to access the admin dashboard.</p>
          <Link to="/admin-login" className="btn btn-danger">Admin Login</Link>
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
            <h1>Admin Dashboard</h1>
            <p className="text-muted">Welcome, {adminInfo.adminName}! Here's your business overview</p>
          </div>
          <Link to="/" className="btn btn-secondary">
            <FaHome /> Home
          </Link>
        </div>

        {isLoading ? (
          <div className="text-center py-4">
            <p>Loading dashboard...</p>
          </div>
        ) : dashboardData ? (
          <div className="dashboard-content">
            {/* Key Metrics */}
            <div className="stats-grid mb-4">
              <div className="stat-card card">
                <div className="stat-icon customers">
                  <FaUser />
                </div>
                <div className="stat-content">
                  <h3>{dashboardData.total_customers}</h3>
                  <p>Total Customers</p>
                </div>
              </div>
              
              <div className="stat-card card">
                <div className="stat-icon team">
                  <FaUsers />
                </div>
                <div className="stat-content">
                  <h3>{dashboardData.total_team_members}</h3>
                  <p>Team Members</p>
                </div>
              </div>
              
              <div className="stat-card card">
                <div className="stat-icon subscriptions">
                  <FaCreditCard />
                </div>
                <div className="stat-content">
                  <h3>{dashboardData.active_subscriptions}</h3>
                  <p>Active Subscriptions</p>
                </div>
              </div>
              
              <div className="stat-card card">
                <div className="stat-icon visits">
                  <FaCalendarAlt />
                </div>
                <div className="stat-content">
                  <h3>{dashboardData.total_visits}</h3>
                  <p>Total Visits</p>
                </div>
              </div>
            </div>

            <div className="grid grid-2">
              {/* Recent Subscriptions */}
              <div className="section-card card">
                <h3>Recent Subscriptions</h3>
                {dashboardData.recent_subscriptions.length === 0 ? (
                  <div className="empty-state">
                    <p>No recent subscriptions</p>
                  </div>
                ) : (
                  <div className="items-list">
                    {dashboardData.recent_subscriptions.map((sub) => (
                      <div key={sub.id} className="item">
                        <div className="item-header">
                          <h4>Subscription #{sub.id.slice(-6)}</h4>
                          <span className={`status ${sub.status}`}>{sub.status}</span>
                        </div>
                        <div className="item-details">
                          <p><strong>Customer:</strong> {sub.customer_id.slice(-8)}</p>
                          <p><strong>Amount:</strong> ₹{sub.monthly_amount.toLocaleString('en-IN')}</p>
                          <p><strong>Created:</strong> {new Date(sub.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Visits */}
              <div className="section-card card">
                <h3>Recent Visits</h3>
                {dashboardData.recent_visits.length === 0 ? (
                  <div className="empty-state">
                    <p>No recent visits</p>
                  </div>
                ) : (
                  <div className="items-list">
                    {dashboardData.recent_visits.slice(0, 5).map((visit) => (
                      <div key={visit.id} className="item">
                        <div className="item-header">
                          <h4>{new Date(visit.scheduled_date).toLocaleDateString()}</h4>
                          <span className={`status ${visit.status}`}>{visit.status}</span>
                        </div>
                        <div className="item-details">
                          <p><strong>Customer:</strong> {visit.customer_id.slice(-8)}</p>
                          <p><strong>Team Member:</strong> {visit.team_member_id.slice(-8)}</p>
                          <p><strong>Time:</strong> {new Date(visit.scheduled_date).toLocaleTimeString()}</p>
                          {visit.customer_rating && (
                            <p><strong>Rating:</strong> {visit.customer_rating} ⭐</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions card mt-4">
              <h3>Quick Actions</h3>
              <div className="actions-grid">
                <button className="action-btn">
                  <FaUser />
                  <span>Manage Customers</span>
                </button>
                
                <button className="action-btn">
                  <FaUsers />
                  <span>Manage Team</span>
                </button>
                
                <button className="action-btn">
                  <FaCalendarAlt />
                  <span>Schedule Visits</span>
                </button>
                
                <button className="action-btn">
                  <FaChartBar />
                  <span>View Reports</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p>Failed to load dashboard data</p>
            <button className="btn" onClick={fetchDashboardData}>Retry</button>
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
          color: var(--danger-color);
          margin-bottom: 0.5rem;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
        }
        
        .stat-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem;
        }
        
        .stat-icon {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.5rem;
        }
        
        .stat-icon.customers {
          background: var(--primary-color);
        }
        
        .stat-icon.team {
          background: var(--accent-color);
        }
        
        .stat-icon.subscriptions {
          background: var(--warning-color);
        }
        
        .stat-icon.visits {
          background: var(--danger-color);
        }
        
        .stat-content h3 {
          font-size: 2.5rem;
          font-weight: bold;
          margin: 0;
        }
        
        .stat-content p {
          color: var(--medium-gray);
          margin: 0;
          font-size: 1rem;
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
        
        .item {
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius);
          padding: 1rem;
          margin-bottom: 1rem;
        }
        
        .item-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }
        
        .item-header h4 {
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
        
        .item-details {
          color: var(--dark-gray);
        }
        
        .item-details p {
          margin-bottom: 0.25rem;
          font-size: 0.9rem;
        }
        
        .quick-actions {
          padding: 2rem;
        }
        
        .quick-actions h3 {
          margin-bottom: 1.5rem;
          color: var(--secondary-color);
          text-align: center;
        }
        
        .actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }
        
        .action-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          padding: 2rem 1rem;
          border: 2px solid var(--border-color);
          border-radius: var(--border-radius);
          background: white;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 1rem;
          color: var(--secondary-color);
        }
        
        .action-btn:hover {
          border-color: var(--primary-color);
          background: var(--light-gray);
          transform: translateY(-2px);
        }
        
        .action-btn svg {
          font-size: 2rem;
          color: var(--primary-color);
        }
        
        @media (max-width: 768px) {
          .dashboard-header {
            flex-direction: column;
            align-items: stretch;
          }
          
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .actions-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        
        @media (max-width: 480px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }
          
          .actions-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;