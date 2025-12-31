import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // When user is logged in, hide the top header (we show dashboard layout instead)
  if (isAuthenticated) return null;

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const handleNavClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-brand">
          <svg className="brand-icon" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2"/>
            <path d="M20 10v20M10 20h20" stroke="currentColor" strokeWidth="2"/>
          </svg>
          <h1>Aqoonsoor</h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="header-nav desktop-nav">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/courses" className="nav-link">Courses</Link>
          {isAuthenticated && <Link to="/dashboard/student" className="nav-link">Dashboard</Link>}
        </nav>

        {/* Desktop Auth */}
        <div className="header-auth desktop-auth">
          {isAuthenticated ? (
            <div className="user-menu">
              <div className="user-info">
                <span className="user-name">{user?.name}</span>
                <span className="user-role">{user?.role}</span>
              </div>
              <button onClick={handleLogout} className="btn btn-primary btn-sm">
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-secondary">Sign In</Link>
              <Link to="/register" className="btn btn-primary">Get Started</Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="mobile-menu-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <nav className="mobile-nav">
          <Link to="/" className="mobile-nav-link" onClick={handleNavClick}>Home</Link>
          <Link to="/courses" className="mobile-nav-link" onClick={handleNavClick}>Courses</Link>
          {isAuthenticated && <Link to="/dashboard/student" className="mobile-nav-link" onClick={handleNavClick}>Dashboard</Link>}
          <hr className="mobile-nav-divider" />
          {isAuthenticated ? (
            <div className="mobile-auth">
              <div className="mobile-user-info">
                <span className="user-name">{user?.name}</span>
                <span className="user-role">{user?.role}</span>
              </div>
              <button onClick={handleLogout} className="btn btn-primary btn-block">
                Logout
              </button>
            </div>
          ) : (
            <div className="mobile-auth-buttons">
              <Link to="/login" className="btn btn-secondary btn-block">Sign In</Link>
              <Link to="/register" className="btn btn-primary btn-block">Get Started</Link>
            </div>
          )}
        </nav>
      )}
    </header>
  );
};

export default Header;
