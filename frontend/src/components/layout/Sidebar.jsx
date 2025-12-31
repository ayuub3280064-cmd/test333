import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, useLocation, NavLink } from 'react-router-dom';

const Sidebar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!isAuthenticated) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  // Student Navigation
  const studentNav = [
    { label: 'Dashboard', path: '/dashboard/student', icon: '📊' },
    { label: 'My Courses', path: '/courses', icon: '📚' },
    { label: 'My Enrollments', path: '/enrollments', icon: '✅' },
    { label: 'Certificates', path: '/certificates', icon: '🏆' },
    { label: 'Wishlist', path: '/wishlist', icon: '❤️' },
  ];

  // Instructor Navigation
  const instructorNav = [
    { label: 'Dashboard', path: '/dashboard/instructor', icon: '📊' },
    { label: 'My Courses', path: '/instructor/courses', icon: '📚' },
    { label: 'Students', path: '/instructor/students', icon: '👥' },
    { label: 'Analytics', path: '/instructor/analytics', icon: '📈' },
    { label: 'Reviews', path: '/instructor/reviews', icon: '⭐' },
    { label: 'Messages', path: '/instructor/messages', icon: '💬' },
  ];

  // Admin Navigation
  const adminNav = [
    { label: 'Dashboard', path: '/dashboard/admin', icon: '📊' },
    { label: 'Users', path: '/admin/users', icon: '👥' },
    { label: 'Courses', path: '/admin/courses', icon: '📚' },
    { label: 'Instructors', path: '/admin/instructors', icon: '🎓' },
    { label: 'Analytics', path: '/admin/analytics', icon: '📈' },
    { label: 'Payments', path: '/admin/payments', icon: '💳' },
    { label: 'Reports', path: '/admin/reports', icon: '📋' },
    { label: 'Settings', path: '/admin/settings', icon: '⚙️' },
  ];

  const getNavigation = () => {
    switch (user?.role) {
      case 'instructor':
        return instructorNav;
      case 'admin':
        return adminNav;
      default:
        return studentNav;
    }
  };

  const navigation = getNavigation();

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      {/* Sidebar Header */}
      <div className="sidebar-header">
        <button
          className="sidebar-toggle"
          onClick={() => setIsCollapsed(!isCollapsed)}
          title="Toggle sidebar"
        >
          ☰
        </button>
        {!isCollapsed && (
          <div className="sidebar-brand">
            <div className="brand-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
          </div>
        )}
      </div>

      {/* User Info */}
      {!isCollapsed && (
        <div className="sidebar-user">
          <div className="user-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
          <div className="user-details">
            <h4>{user?.name}</h4>
            <span className="user-role">{user?.role}</span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="sidebar-nav">
        {navigation.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive: active }) => `sidebar-item ${active ? 'active' : ''}`}
            title={isCollapsed ? item.label : ''}
            onClick={() => { if (isCollapsed) setIsCollapsed(false); }}
          >
            <span className="nav-icon">{item.icon}</span>
            {!isCollapsed && <span className="nav-label">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Sidebar Footer */}
      <div className="sidebar-footer">
        {!isCollapsed && (
          <>
            <NavLink to="/profile" className="sidebar-item">
              <span className="nav-icon">👤</span>
              <span className="nav-label">Profile</span>
            </NavLink>
            <NavLink to="/settings" className="sidebar-item">
              <span className="nav-icon">⚙️</span>
              <span className="nav-label">Settings</span>
            </NavLink>
          </>
        )}
        <button onClick={handleLogout} className="sidebar-item logout-btn">
          <span className="nav-icon">🚪</span>
          {!isCollapsed && <span className="nav-label">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
