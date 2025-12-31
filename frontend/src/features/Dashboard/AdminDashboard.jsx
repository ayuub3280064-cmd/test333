import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = React.useState({
    users: 0,
    courses: 0,
    enrollments: 0,
    revenue: 0,
  });
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${API_URL}/users`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setStats({
            users: Array.isArray(data) ? data.length : 0,
            courses: 24,
            enrollments: 156,
            revenue: 12450,
          });
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner-circle"></div>
        <p>Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1>Admin Dashboard 🛡️</h1>
          <p className="dashboard-subtitle">System overview and management</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="dashboard-stats">
        <div className="stat-card gradient-blue">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>Total Users</h3>
            <p className="stat-number">{stats.users}</p>
          </div>
        </div>
        <div className="stat-card gradient-green">
          <div className="stat-icon">📚</div>
          <div className="stat-content">
            <h3>Total Courses</h3>
            <p className="stat-number">{stats.courses}</p>
          </div>
        </div>
        <div className="stat-card gradient-orange">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>Enrollments</h3>
            <p className="stat-number">{stats.enrollments}</p>
          </div>
        </div>
        <div className="stat-card gradient-purple">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>Total Revenue</h3>
            <p className="stat-number">${stats.revenue / 1000}k</p>
          </div>
        </div>
      </div>

      {/* Admin Actions */}
      <section className="dashboard-section">
        <h2>Management Tools</h2>
        <div className="admin-grid">
          <Link to="/admin/users" className="admin-action-card">
            <div className="action-icon">👥</div>
            <h3>Manage Users</h3>
            <p>View and manage all users</p>
            <span className="arrow">→</span>
          </Link>
          <Link to="/admin/courses" className="admin-action-card">
            <div className="action-icon">📚</div>
            <h3>Manage Courses</h3>
            <p>Review and approve courses</p>
            <span className="arrow">→</span>
          </Link>
          <Link to="/admin/instructors" className="admin-action-card">
            <div className="action-icon">🎓</div>
            <h3>Instructors</h3>
            <p>Manage instructor accounts</p>
            <span className="arrow">→</span>
          </Link>
          <Link to="/admin/analytics" className="admin-action-card">
            <div className="action-icon">📊</div>
            <h3>Analytics</h3>
            <p>View platform analytics</p>
            <span className="arrow">→</span>
          </Link>
          <Link to="/admin/payments" className="admin-action-card">
            <div className="action-icon">💳</div>
            <h3>Payments</h3>
            <p>Manage transactions</p>
            <span className="arrow">→</span>
          </Link>
          <Link to="/admin/settings" className="admin-action-card">
            <div className="action-icon">⚙️</div>
            <h3>Settings</h3>
            <p>System configuration</p>
            <span className="arrow">→</span>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
