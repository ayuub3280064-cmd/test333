import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Footer = () => {
  const { isAuthenticated } = useAuth();
  const currentYear = new Date().getFullYear();

  if (isAuthenticated) return null;

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Aqoonsoor LMS</h3>
          <p>Wadatashi cimri oo casri ah oo furan</p>
        </div>

        <div className="footer-section">
          <h4>Xidhiidhka</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/courses">Courses</Link></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Social</h4>
          <ul>
            <li><a href="#">Facebook</a></li>
            <li><a href="#">Twitter</a></li>
            <li><a href="#">LinkedIn</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {currentYear} Aqoonsoor. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
